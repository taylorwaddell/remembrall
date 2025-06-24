import { Input } from "@base-ui-components/react/input";
export default async function SearchCreate() {
  return (
    <div className="flex h-fit w-1/3 rounded-full border-1 p-2">
      <Input
        placeholder="search"
        className="width-full flex-1 rounded-full p-3"
      />
      <button type="submit" className="w-25 rounded-full p-2">
        <span>→</span>
      </button>
    </div>
  );
}
