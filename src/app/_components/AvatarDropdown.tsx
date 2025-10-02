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
          <Avatar.Root className="block h-10 w-10">
            <Avatar.Image src={user.image} className="rounded-full" />
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
      <></>
    );
  };

  return (
    <Menu.Root>
      <Menu.Trigger className="h-fit w-fit cursor-pointer">
        {userImage()}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="rounded-md bg-zinc-100 p-2 dark:bg-zinc-700">
            {userInfo()}
            <Menu.Item className="flex">
              <Link
                className="btn flex-1 rounded-md bg-zinc-950 py-1 text-center text-white dark:bg-zinc-100 dark:text-black"
                href={"/api/auth/signout"}
              >
                {"Sign out"}
              </Link>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
