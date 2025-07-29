"use client";

import type { MemoryNode } from "@prisma/client";
import { Loader, Trash } from "lucide-react";
import { LinkItUrl } from "react-linkify-it";
import { toast } from "sonner";
import { api } from "~/trpc/react";

interface MemoryNodeProps {
  memoryNode: MemoryNode;
  className?: string;
  refreshData: () => Promise<void>;
}

export default function MemoryNode({
  memoryNode,
  className,
  refreshData,
}: MemoryNodeProps) {
  const deleteMemoryNode = api.memoryNode.deleteMemoryNodeById.useMutation({
    onSuccess: async (result) => {
      if (result.ok) {
        toast.success(`Memory deleted`, { description: result.value });
        await refreshData();
      } else {
        toast.error(`Failed to delete memory`, {
          description: result.error.message,
        });
      }
    },
  });

  const handleDeletion = async () => {
    if (deleteMemoryNode.isPending) return;
    deleteMemoryNode.mutate({ memoryNodeId: memoryNode.id });
  };

  return (
    <li
      className={`flex justify-between rounded-md bg-stone-800 p-2 ${className}`}
    >
      <LinkItUrl className="contents text-blue-400 hover:underline">
        {memoryNode.text}
      </LinkItUrl>
      <button
        type="button"
        className="cursor-pointer rounded px-2 hover:bg-stone-900"
        onClick={() => handleDeletion()}
        disabled={deleteMemoryNode.isPending}
      >
        {!deleteMemoryNode.isPending ? (
          <Trash size={16} />
        ) : (
          <>
            <Loader
              aria-hidden="true"
              className="mx-auto animate-spin"
              size={16}
            />
            <span className="sr-only">Deleting node...</span>
          </>
        )}
      </button>
    </li>
  );
}
