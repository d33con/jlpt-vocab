import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import JLPTLevels from "../utils/levels";
import FuriganaToggle from "./FuriganaToggle";

const Header: React.FC = () => {
  const isActive: (pathname: string) => boolean = (pathname) =>
    usePathname() === pathname;

  const { data: session, status } = useSession();

  let left = null;

  let right = null;

  if (status === "loading") {
    right = (
      <div className="ml-auto">
        <div className="text-center loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!session) return null;

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
              className={`btn btn-neutral btn-outline mr-2 last-of-type:mr-4 ${
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
      <div className="ml-auto">
        <div className="flex justify-center items-center pr-4 text-gray-600">
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
    <nav className="sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm shadow-sm">
      <div className="hidden 2xl:flex p-8 items-center ">
        {left}
        {right}
      </div>
      <div className="flex items-center 2xl:hidden p-8">
        <label
          htmlFor="drawer-menu"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-sky-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        <span className="text-3xl font-bold text-sky-800 m-auto">
          JLPT Vocab
        </span>
      </div>
    </nav>
  );
};

export default Header;
