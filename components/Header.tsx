import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import levels from "../utils/levels";
import Image from "next/image";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.asPath === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div>
      <Link href="/" legacyBehavior>
        <a className="font-bold" data-active={isActive("/")}>
          Home
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status === "loading") {
    right = (
      <div className="ms-auto">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="ms-auto">
        <Link href="/api/auth/signin" legacyBehavior>
          <a
            className="inline-block bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
            data-active={isActive("/signup")}
          >
            Log in
          </a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div>
        <Link href="/" legacyBehavior>
          <a className="font-bold mr-2" data-active={isActive("/")}>
            Home
          </a>
        </Link>
        {levels.map((level) => (
          <Link href={`/level/${level}`} legacyBehavior>
            <a
              className=" bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow mr-2"
              data-active={isActive(`/level/${level}`)}
            >
              JLPT Level {level}
            </a>
          </Link>
        ))}
      </div>
    );
    right = (
      <div className="ms-auto">
        <p className="flex justify-center items-center pr-4 text-sm text-gray-800">
          Welcome {session.user.name}
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={50}
            height={50}
            className="rounded ml-4"
          />
        </p>
        <Link href="/my-words" legacyBehavior>
          <button className="mr-2">
            <a className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow">
              My words
            </a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow">
            Log out
          </a>
        </button>
      </div>
    );
  }

  return (
    <nav className="flex p-8 items-center">
      {left}
      {right}
    </nav>
  );
};

export default Header;
