import { Avatar } from "@base-ui-components/react/avatar";
import Link from "next/link";
import { Menu } from "@base-ui-components/react/menu";
import { auth } from "~/server/auth";

export default async function AvatarDropdown() {
  const session = await auth();

  const userImage = () => {
    const user = session?.user;
    const fallbackClasses = "block h-10 w-10 rounded-full";
    if (user) {
      const firstLetter = user.name ? user.name[0] : "";
      if (user.image) {
        return (
          <Avatar.Root className="block h-10 w-10 rounded-full">
            <Avatar.Image src={user.image} className="w-fit rounded-full" />
            <Avatar.Fallback className={fallbackClasses}>
              {firstLetter}
            </Avatar.Fallback>
          </Avatar.Root>
        );
      } else {
        return (
          <Avatar.Root className="">
            <Avatar.Fallback className={fallbackClasses}>
              {firstLetter}
            </Avatar.Fallback>
          </Avatar.Root>
        );
      }
    }
  };

  const userInfo = () => {
    const user = session?.user;
    return Boolean(user) ? (
      <Menu.Item className="rounded-md px-3 pt-1 pb-3 text-right">
        <p>{user?.name}</p>
        <small className="text-zinc-500 dark:text-zinc-400">
          {user?.email}
        </small>
      </Menu.Item>
    ) : (
      null
    );
  };

  return (
    <Menu.Root>
      <Menu.Trigger render={userImage()} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="rounded-md bg-zinc-100 p-2 dark:bg-zinc-700">
            {userInfo()}
            <Menu.Item
              render={
                <Link
                  className="btn block rounded-md bg-zinc-950 py-1 text-center text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                  href="/api/auth/signout"
                >
                  Sign out
                </Link>
              }
            />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
