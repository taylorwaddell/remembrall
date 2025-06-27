"use client";

import { ArrowRight, Loader, Pencil, Plane, Search, Send } from "lucide-react";

import { Input } from "@base-ui-components/react/input";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useState, type FormEvent } from "react";
import { LinkItUrl } from "react-linkify-it";

export default function SearchCreate() {
  const [userText, setUserText] = useState("");
  const [mode, setMode] = useState<Mode>(Mode.Search);
  const [nodes, setNodes] = useState<
    {
      text: string;
    }[]
  >([]);
  const memoryNodeCount = api.memoryNode.getMemoryNodeCountByUserId.useQuery();
  const createMemoryNode = api.memoryNode.createMemoryNode.useMutation({
    onSuccess: (result) => {
      if (result.ok) {
        toast.success(`Memory created`, { description: result.value.text });
        setUserText("");
      } else {
        toast.error(`Failed to create memory.`, {
          description: result.error.message,
        });
      }
    },
  });
  const { refetch, isFetching } =
    api.memoryNode.getMemoryNodesByUserId.useQuery(
      {
        query: userText,
      },
      { enabled: false },
    );
  const submitNewNode = async (e: FormEvent) => {
    e.preventDefault();
    if (isFetching || createMemoryNode.isPending) return;
    if (mode === Mode.Create) {
      createMemoryNode.mutate({ userText });
    } else {
      const { data } = await refetch();
      if (data) setNodes(data);
    }
  };
  const setModeState = (modeEvent: string) => {
    if (!parseInt(modeEvent)) return;
    setMode(parseInt(modeEvent));
  };

  return (
    <form
      className="flex h-fit w-100 flex-col gap-1 md:w-2/3 lg:w-1/3"
      onSubmit={(e) => submitNewNode(e)}
    >
      <div className="flex items-baseline justify-between pb-2">
        <ToggleGroup
          defaultValue={[String(Mode.Search)]}
          onValueChange={(e) => setModeState(String(e))}
          className="flex w-fit rounded-full"
        >
          <Toggle
            value={String(Mode.Search)}
            className="mr-2 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 active:bg-blue-400 active:text-stone-800 data-[pressed]:bg-blue-400 data-[pressed]:text-stone-800"
          >
            <Search size={16} /> Search
          </Toggle>
          <Toggle
            value={String(Mode.Create)}
            className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 active:bg-yellow-400 active:text-stone-800 data-[pressed]:bg-yellow-400 data-[pressed]:text-stone-800"
          >
            <Pencil size={16} /> Create
          </Toggle>
        </ToggleGroup>
        <small
          className={`mr-8 h-fit rounded-sm bg-white px-1 text-stone-800 ${memoryNodeCount.isLoading && "py-1"}`}
        >
          {!memoryNodeCount.isLoading && memoryNodeCount?.data?.ok ? (
            memoryNodeCount.data.value
          ) : (
            <Loader className="mx-auto animate-spin" size={10} />
          )}
        </small>
      </div>
      <div className="flex h-fit w-full rounded-full border-1 p-2">
        <Input
          placeholder="search"
          value={userText}
          onChange={({ target }) => setUserText(target.value)}
          className="width-full flex-1 rounded-full p-3"
          disabled={isFetching || createMemoryNode.isPending}
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
          ) : mode === Mode.Search ? (
            <Search aria-hidden="true" className="mx-auto" />
          ) : (
            <Send aria-hidden="true" className="mx-auto" />
          )}
          <span className="sr-only">
            {isFetching || createMemoryNode.isPending
              ? "Loading..."
              : mode === Mode.Search
                ? "Search"
                : "Create"}
          </span>
        </button>
      </div>
      {Boolean(nodes?.length) && (
        <ul className="mt-2 list-disc">
          {nodes.map((n) => (
            <li className="mb-2" key={n.text}>
              <LinkItUrl className="text-blue-400 hover:underline">
                {n.text}
              </LinkItUrl>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

enum Mode {
  Search = 1,
  Create = 2,
}
