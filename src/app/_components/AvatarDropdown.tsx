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

  return (
    <Menu.Root>
      <Menu.Trigger className="h-fit w-fit cursor-pointer">
        {userImage()}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="rounded-sm px-2 py-2">
            <Menu.Item className="rounded-md px-6 py-1">
              <Link href={"/api/auth/signout"}>{"Sign out"}</Link>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
