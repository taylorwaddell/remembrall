import { HydrateClient, api } from "~/trpc/server";

import AvatarDropdown from "./_components/AvatarDropdown";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();
  // const hello = await api.post.hello({
  //   text: !session ? "there" : (session.user.name ?? "there"),
  // });

  if (session?.user) {
    void api.post.getLatest.prefetch();
    console.log(session.user);
  }

  return (
    <HydrateClient>
      {session ? (
        <>
          <nav className="flex justify-between bg-stone-800 p-3 text-stone-100">
            <h1 className="text-3xl">Remembrall</h1>
            <AvatarDropdown />
          </nav>
          <main className="flex min-h-screen justify-between bg-stone-800 p-3 text-stone-100"></main>
        </>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center bg-stone-800 text-white">
          <h1 className="text-3xl">Remembrall</h1>
          <Link
            href={"/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {"Sign in"}
          </Link>
        </main>
      )}
    </HydrateClient>
  );
}
