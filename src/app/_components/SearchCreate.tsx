"use client";

import { Loader, Pencil, Search, Send } from "lucide-react";

import { Input } from "@base-ui-components/react/input";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useState, type FormEvent } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import MemoryNode from "./MemoryNode";
import type { MemoryNode as MemoryNodeType } from "@prisma/client";

export default function SearchCreate() {
  const [userText, setUserText] = useState("");
  const [mode, setMode] = useState<Mode[]>([Mode.Search]);
  const [nodes, setNodes] = useState<MemoryNodeType[]>([]);
  useHotkeys("1", () => setMode([Mode.Search]), [mode]);
  useHotkeys("2", () => setMode([Mode.Create]), [mode]);
  const memoryNodeCount = api.memoryNode.getMemoryNodeCountByUserId.useQuery();
  const createMemoryNode = api.memoryNode.createMemoryNode.useMutation({
    onSuccess: (result) => {
      if (result.ok) {
        toast.success(`Memory created`, { description: result.value.text });
        setUserText("");
      } else {
        toast.error(`Failed to create memory`, {
          description: result.error.message,
        });
      }
    },
  });
  const { refetch, isFetching } =
    api.memoryNode.fullTextSearchMemoryNodes.useQuery(
      {
        query: userText,
      },
      { enabled: false },
    );
  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();
    if (isFetching || createMemoryNode.isPending) return;
    if (mode.includes(Mode.Create)) {
      createMemoryNode.mutate({ userText });
    } else {
      const { data } = await refetch();
      if (data?.ok) setNodes(data.value);
    }
  };
  const setModeState = (modeEvent: Mode) => {
    setMode([modeEvent]);
  };
  const refreshCountAndResults = async () => {
    const countResponse = await memoryNodeCount.refetch();
    const searchResponse = await refetch();

    if (countResponse.data?.ok) {
    }
    if (searchResponse.data?.ok) {
      setNodes(searchResponse.data.value);
    }
  };

  return (
    <form
      className="flex h-fit w-100 flex-col gap-1 md:w-2/3 lg:w-1/3"
      onSubmit={(e) => handleSubmission(e)}
    >
      <div className="flex items-baseline justify-between pb-2">
        <ToggleGroup value={[mode]} className="flex w-fit rounded-full">
          <Toggle
            value={Mode.Search}
            data-pressed={mode.includes(Mode.Search)}
            onClick={() => setModeState(Mode.Search)}
            className="mr-2 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 active:bg-blue-400 active:text-stone-800 data-[pressed=true]:bg-blue-400 data-[pressed=true]:text-stone-800"
          >
            <Search aria-hidden="true" size={16} /> Search
          </Toggle>
          <Toggle
            value={Mode.Create}
            data-pressed={mode.includes(Mode.Create)}
            onClick={() => setModeState(Mode.Create)}
            className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 active:bg-yellow-400 active:text-stone-800 data-[pressed=true]:bg-yellow-400 data-[pressed=true]:text-stone-800"
          >
            <Pencil aria-hidden="true" size={16} /> Create
          </Toggle>
        </ToggleGroup>
        <small
          className={`mr-8 h-fit rounded-sm bg-white px-1 text-stone-800 ${memoryNodeCount.isLoading && "py-1"}`}
        >
          {!memoryNodeCount.isLoading && memoryNodeCount?.data?.ok ? (
            memoryNodeCount.data.value
          ) : (
            <>
              <Loader
                aria-hidden="true"
                className="mx-auto animate-spin"
                size={10}
              />
              <span className="sr-only">Loading node count...</span>
            </>
          )}
        </small>
      </div>
      <div className="flex h-fit w-full rounded-full border-1 p-2">
        <Input
          placeholder="search"
          value={userText}
          onChange={({ target }) => setUserText(target.value)}
          className="width-full flex-1 rounded-full p-3"
          disabled={createMemoryNode.isPending}
        />
        <button
          type="submit"
          className="w-25 rounded-full p-2"
          disabled={
            isFetching || createMemoryNode.isPending || userText?.length < 1
          }
        >
          {isFetching || createMemoryNode.isPending ? (
            <Loader aria-hidden="true" className="mx-auto animate-spin" />
          ) : mode.includes(Mode.Search) ? (
            <Search aria-hidden="true" className="mx-auto" />
          ) : (
            <Send aria-hidden="true" className="mx-auto" />
          )}
          <span className="sr-only">
            {isFetching || createMemoryNode.isPending
              ? "Loading..."
              : mode.includes(Mode.Search)
                ? "Search"
                : "Create"}
          </span>
        </button>
      </div>
      {Boolean(nodes?.length) && (
        <ul className="mt-3">
          {nodes.map((n) => (
            <MemoryNode
              key={n.id}
              memoryNode={n}
              className="mb-2"
              refreshData={refreshCountAndResults}
            />
          ))}
        </ul>
      )}
    </form>
  );
}

enum Mode {
  Search = "Search",
  Create = "Create",
}
