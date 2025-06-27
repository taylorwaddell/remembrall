"use client";

import { ArrowRight, Loader, Pencil, Search } from "lucide-react";

import { Input } from "@base-ui-components/react/input";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useState, type FormEvent } from "react";

export default function SearchCreate() {
  const [userText, setUserText] = useState("");
  const [mode, setMode] = useState<Mode>(Mode.Search);
  const [nodes, setNodes] = useState<
    {
      text: string;
    }[]
  >([]);
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
      <ToggleGroup
        defaultValue={[String(Mode.Search)]}
        onValueChange={(e) => setModeState(String(e))}
        className="flex w-fit rounded-full p-2"
      >
        <Toggle
          value={String(Mode.Search)}
          className="mr-2 flex items-center gap-2 rounded-full px-3 py-1 active:bg-stone-200 active:text-stone-800 data-[pressed]:bg-stone-200 data-[pressed]:text-stone-800"
        >
          <Search size={16} /> Search
        </Toggle>
        <Toggle
          value={String(Mode.Create)}
          className="flex items-center gap-2 rounded-full px-3 py-1 active:bg-stone-200 active:text-stone-800 data-[pressed]:bg-stone-200 data-[pressed]:text-stone-800"
        >
          <Pencil size={16} /> Create
        </Toggle>
      </ToggleGroup>
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
          disabled={isFetching || createMemoryNode.isPending}
        >
          {isFetching || createMemoryNode.isPending ? (
            <Loader className="mx-auto animate-spin" />
          ) : (
            <ArrowRight className="mx-auto" />
          )}
        </button>
      </div>
      {Boolean(nodes?.length) && (
        <ul className="mt-2 list-disc">
          {nodes.map((n) => (
            <li className="mb-2" key={n.text}>
              {n.text}
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
