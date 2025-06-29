-- Create the FTS5 table
CREATE VIRTUAL TABLE MemoryNodeFTS USING fts5(
  memoryNodeId UNINDEXED,
  text,
  tags,
  tokenize = 'porter'
);

-- Rebuild the helper view
CREATE VIEW MemoryNodeWithTags AS
SELECT
  mn.id               AS memoryNodeId,
  mn.text,
  GROUP_CONCAT(t.text, ' ') AS tags
FROM MemoryNode mn
LEFT JOIN Tag t
  ON mn.id = t.memoryNodeId
GROUP BY mn.id;

-- Triggers to keep FTS index in sync
CREATE TRIGGER memorynode_ai AFTER INSERT ON MemoryNode BEGIN
  INSERT INTO MemoryNodeFTS(memoryNodeId, text, tags)
  VALUES (
    new.id,
    new.text,
    COALESCE((SELECT GROUP_CONCAT(text, ' ') FROM Tag WHERE memoryNodeId = new.id), '')
  );
END;

CREATE TRIGGER memorynode_ad AFTER DELETE ON MemoryNode BEGIN
  DELETE FROM MemoryNodeFTS WHERE memoryNodeId = old.id;
END;

CREATE TRIGGER memorynode_au AFTER UPDATE ON MemoryNode BEGIN
  UPDATE MemoryNodeFTS
  SET
    text = new.text,
    tags = COALESCE((SELECT GROUP_CONCAT(text, ' ') FROM Tag WHERE memoryNodeId = new.id), '')
  WHERE memoryNodeId = new.id;
END;

CREATE TRIGGER tag_ai AFTER INSERT ON Tag BEGIN
  UPDATE MemoryNodeFTS
  SET tags = COALESCE((SELECT GROUP_CONCAT(text, ' ') FROM Tag WHERE memoryNodeId = new.memoryNodeId), '')
  WHERE memoryNodeId = new.memoryNodeId;
END;

CREATE TRIGGER tag_ad AFTER DELETE ON Tag BEGIN
  UPDATE MemoryNodeFTS
  SET tags = COALESCE((SELECT GROUP_CONCAT(text, ' ') FROM Tag WHERE memoryNodeId = old.memoryNodeId), '')
  WHERE memoryNodeId = old.memoryNodeId;
END;