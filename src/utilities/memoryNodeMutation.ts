import React from "react";
import { api } from "~/trpc/react";

export function useInvalidateMemory() {
  const utils = api.useUtils();
  return React.useCallback(() => {
    return Promise.all([
      utils.memoryNode.getMemoryNodeCountByUserId.invalidate(),
    ]);
  }, [utils]);
}
