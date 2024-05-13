import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import JLPTLevels from "../../utils/levels";
import FuriganaToggle from "./FuriganaToggle";

const DrawerMenu = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (link: string) => link === pathname;

  const handleCloseMenu = () => {
    document.getElementById("drawer-menu").click();
  };

  if (!session) return null;

  return (
    <div className="menu p-8 w-80 min-h-full bg-gray-100">
      <div className="flex justify-end mb-2">
        <button
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => handleCloseMenu()}
        >
          ✕
        </button>
      </div>
      <div className="flex justify-between text-gray-600">
        <Image
          src={session.user.image}
          alt={session.user.name}
          width={54}
          height={54}
          className="rounded"
        />
        <Link href="/my-lists" legacyBehavior>
          <button
            className={`btn btn-neutral btn-outline ${
              isActive(`/my-lists`) && "btn-active"
            }`}
          >
            My lists
          </button>
        </Link>
        <FuriganaToggle />
      </div>
      <div className="divider"></div>
      <ul>
        {JLPTLevels.map((level) => (
          <li
            className={`text-xl mb-2 text-gray-600 hover:text-gray-800 cursor-pointer ${
              isActive(`/level/all/${level}`) && "btn-active"
            }`}
            key={level}
          >
            <Link href={`/level/all/${level}`} legacyBehavior>
              <div>JLPT Level {level}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="divider"></div>
      <button onClick={() => signOut()} className="btn btn-neutral">
        Log out
      </button>
    </div>
  );
};

export default DrawerMenu;
