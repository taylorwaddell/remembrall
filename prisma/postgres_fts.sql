-- PostgreSQL Full-Text Search Setup for MemoryNode
-- This replaces the SQLite FTS5 implementation

-- Create a materialized view that combines MemoryNode text with tags for full-text search
CREATE MATERIALIZED
VIEW memory_node_search AS
SELECT
    mn.id AS memory_node_id,
    mn."userId" AS user_id,
    mn.text,
    mn.created,
    COALESCE(STRING_AGG(t.text, ' '), '') AS tags,
    -- Create a single searchable text column using PostgreSQL full-text search
    to_tsvector('english', 
    mn.text || ' ' || COALESCE(STRING_AGG(t.text, ' '), '')
  ) AS search_vector
FROM "MemoryNode" mn
    LEFT JOIN "Tag" t ON mn.id = t."memoryNodeId"
GROUP BY mn.id, mn."userId", mn.text, mn.created;

-- Create a GIN index on the search vector for fast full-text search
CREATE INDEX idx_memory_node_search_vector ON memory_node_search USING GIN
(search_vector);

-- Create an index on user_id for filtering
CREATE INDEX idx_memory_node_search_user_id ON memory_node_search(user_id);

-- Function to refresh the materialized view (call after data changes)
CREATE OR REPLACE FUNCTION refresh_memory_node_search
()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY memory_node_search;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically refresh the materialized view when data changes
-- Note: For high-frequency updates, consider refreshing periodically instead of on every change

-- Trigger for MemoryNode changes
CREATE TRIGGER refresh_search_on_memory_node_change
  AFTER
INSERT OR
UPDATE OR DELETE ON "MemoryNode"
  FOR EACH STATEMENT
EXECUTE FUNCTION refresh_memory_node_search
();

-- Trigger for Tag changes  
CREATE TRIGGER refresh_search_on_tag_change
  AFTER
INSERT OR
UPDATE OR DELETE ON "Tag"
  FOR EACH STATEMENT
EXECUTE FUNCTION refresh_memory_node_search
();

-- Function to search memories with ranking
CREATE OR REPLACE FUNCTION search_memory_nodes
(
  search_query TEXT,
  user_id_param TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE
(
  id INTEGER,
  text TEXT,
  created TIMESTAMP
(3),
  "userId" TEXT,
  rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mns.memory_node_id AS id,
        mns.text,
        mns.created,
        mns.user_id AS "userId",
        ts_rank(mns.search_vector, plainto_tsquery('english', search_query)) AS rank
    FROM memory_node_search mns
    WHERE 
    mns.user_id = user_id_param
        AND mns.search_vector
    @@ plainto_tsquery
    ('english', search_query)
  ORDER BY rank DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;