import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import JLPTLevels from "../utils/levels";
import FuriganaToggle from "./FuriganaToggle";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.asPath === pathname;

  const { data: session, status } = useSession();

  let left = null;

  let right = null;

  if (status === "loading") {
    right = (
      <div className="ms-auto">
        <div className="text-center loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="ms-auto">
        <Link href="/api/auth/signin" legacyBehavior>
          <button className="btn btn-neutral text-lg">Log In</button>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="me-auto flex">
        <Link href="/" legacyBehavior>
          <button
            className={`btn btn-ghost text-lg mr-2 ${
              isActive("/") && "btn-active"
            }`}
          >
            Home
          </button>
        </Link>
        {JLPTLevels.map((level) => (
          <Link href={`/level/all/${level}`} legacyBehavior key={level}>
            <button
              className={`btn btn-neutral btn-outline mr-2 ${
                isActive(`/level/all/${level}`) && "btn-active"
              }`}
            >
              JLPT Level {level}
            </button>
          </Link>
        ))}
        <FuriganaToggle />
      </div>
    );
    right = (
      <div className="ms-auto">
        <div className="flex justify-center items-center pr-4 text-gray-800">
          <span>Welcome, {session.user.name}</span>
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={54}
            height={54}
            className="rounded mx-4"
          />
          <Link href="/my-lists" legacyBehavior>
            <button
              className={`btn btn-neutral btn-outline mr-2 ${
                isActive(`/my-lists`) && "btn-active"
              }`}
            >
              My lists
            </button>
          </Link>
          <button onClick={() => signOut()} className="btn btn-neutral">
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav className="flex p-8 items-center sticky top-0 z-10 bg-gray-100 shadow-sm">
      {left}
      {right}
    </nav>
  );
};

export default Header;
