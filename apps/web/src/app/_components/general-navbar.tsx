import type { Session } from "next-auth";
import Link from "next/link";

const NavBar = ({ session }: {session: Session}) => {

  return (
    <div className="mx-auto my-2 flex h-max w-5/6 items-center justify-between rounded-xl border-b border-r border-blue-900 border-opacity-60 px-4 py-2">
      <div className="flex gap-4">
        <Link href="/">
          <p className="font-mono text-2xl font-bold text-white/80 transition hover:text-white">
            Y Message
          </p>
        </Link>
      </div>
      <p className="text-center text-2xl text-white">
        {session ? session.user.name ?? "No User" : "No Session"}
      </p>
      <div className="flex gap-4">
        <Link href={`/api/auth/${session ? "signout" : "signin"}`}>
          <p className="text-white/80 transition hover:text-white">
            {session ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
