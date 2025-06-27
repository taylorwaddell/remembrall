import { LinkItUrl } from "react-linkify-it";

interface MemoryNodeProps {
  text: string;
  className?: string;
}

export default function MemoryNode({ text, className }: MemoryNodeProps) {
  return (
    <li className={`rounded-md bg-stone-800 p-2 ${className}`}>
      <LinkItUrl className="text-blue-400 hover:underline">{text}</LinkItUrl>
    </li>
  );
}
