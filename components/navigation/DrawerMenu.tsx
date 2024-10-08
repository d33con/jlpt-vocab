import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import JLPTLevels from "../../utils/levels";
import FuriganaToggle from "./FuriganaToggle";
import ShowKanjiToggle from "./ShowKanjiToggle";

const DrawerMenu = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (link: string) => link === pathname;

  const handleCloseMenu = () => {
    document.getElementById("drawer-menu").click();
  };

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
      {session && (
        <>
          <div className="flex justify-between items-center text-gray-600">
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={54}
              height={54}
              className="rounded"
            />
            <span>{session.user.name}</span>
            <Link href="/my-lists" legacyBehavior>
              <button
                className={`btn btn-neutral btn-outline ${
                  isActive(`/my-lists`) && "btn-active"
                }`}
              >
                My lists
              </button>
            </Link>
          </div>
          <div className="flex justify-between text-gray-600 mt-8">
            <FuriganaToggle />
            <ShowKanjiToggle />
          </div>
          <div className="divider"></div>
        </>
      )}
      <ul>
        {JLPTLevels.map((level) => (
          <li
            className={`text-xl mb-2 text-gray-600 hover:text-gray-800 cursor-pointer ${
              (isActive(`/level/all/${level}`) ||
                isActive(`/level/random/${level}`)) &&
              "btn-active"
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
      {session ? (
        <button onClick={() => signOut()} className="btn btn-neutral">
          Log out
        </button>
      ) : (
        <button onClick={() => signIn()} className="btn btn-neutral">
          Log in
        </button>
      )}
    </div>
  );
};

export default DrawerMenu;
