import { Input } from "@base-ui-components/react/input";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";

export default async function SearchCreate() {
  return (
    <div className="flex h-fit w-1/3 flex-col gap-1">
      <ToggleGroup defaultValue={["search"]} className="w-fit rounded-full p-2">
        <Toggle
          value="search"
          className="mr-2 rounded-full px-3 py-1 active:bg-stone-200 active:text-stone-800 data-[pressed]:bg-stone-200 data-[pressed]:text-stone-800"
        >
          🔍 Search
        </Toggle>
        <Toggle
          value="create"
          className="rounded-full px-3 py-1 active:bg-stone-200 active:text-stone-800 data-[pressed]:bg-stone-200 data-[pressed]:text-stone-800"
        >
          ✏️ Create
        </Toggle>
      </ToggleGroup>
      <div className="flex h-fit w-full rounded-full border-1 p-2">
        <Input
          placeholder="search"
          className="width-full flex-1 rounded-full p-3"
        />
        <button type="submit" className="w-25 rounded-full p-2">
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
