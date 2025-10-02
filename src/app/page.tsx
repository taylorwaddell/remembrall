import AvatarDropdown from "./_components/AvatarDropdown";
import { HydrateClient } from "~/trpc/server";
import Link from "next/link";
import SearchCreate from "./_components/SearchCreate";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      {session ? (
        <>
          <nav className="flex justify-between p-3">
            <h1 className="text-3xl">Remembrall</h1>
            <AvatarDropdown />
          </nav>
          <main className="flex min-h-screen items-center justify-center p-3">
            <SearchCreate />
          </main>
        </>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="mb-4 text-3xl">Remembrall</h1>
          <Link
            href={"/api/auth/signin"}
            className="btn rounded-md bg-zinc-100 px-10 py-2 font-semibold no-underline transition"
            autoFocus
          >
            {"Sign in"}
          </Link>
        </main>
      )}
    </HydrateClient>
  );
}
