"use client";

import type { MemoryNode } from "@prisma/client";
import { Loader, Trash } from "lucide-react";
import { LinkItUrl } from "react-linkify-it";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useInvalidateMemory } from "~/utilities/memoryNodeMutation";

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
  const invalidateMemory = useInvalidateMemory();
  const deleteMemoryNode = api.memoryNode.deleteMemoryNodeById.useMutation({
    onSuccess: async (result) => {
      if (result.ok) {
        toast.success(`Memory deleted`, { description: result.value });
        await invalidateMemory();
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
      className={`flex justify-between rounded-sm p-2 ${className} bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-200`}
    >
      <LinkItUrl className="text-blue-600 hover:underline dark:text-blue-400">
        <p className="dark:text-zinc-200">{memoryNode.text}</p>
      </LinkItUrl>
      <button
        type="button"
        className="cursor-pointer rounded px-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950"
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
