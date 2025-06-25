"use client";

import { ArrowRight, Pencil, Search } from "lucide-react";

import { Input } from "@base-ui-components/react/input";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function SearchCreate() {
  const [userText, setUserText] = useState("");
  const createMemoryNode = api.memoryNode.createMemoryNode.useMutation({
    onSuccess: () => console.log("yeah bro"),
  });
  const submitNewNode = async () => {
    createMemoryNode.mutate({ userText });
  };

  return (
    <form className="flex h-fit w-1/3 flex-col gap-1" onSubmit={submitNewNode}>
      <ToggleGroup
        defaultValue={["search"]}
        className="flex w-fit rounded-full p-2"
      >
        <Toggle
          value="search"
          className="mr-2 flex items-center gap-2 rounded-full px-3 py-1 active:bg-stone-200 active:text-stone-800 data-[pressed]:bg-stone-200 data-[pressed]:text-stone-800"
        >
          <Search size={16} /> Search
        </Toggle>
        <Toggle
          value="create"
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
        />
        <button type="submit" className="w-25 rounded-full p-2">
          <ArrowRight className="mx-auto" />
        </button>
      </div>
    </form>
  );
}
