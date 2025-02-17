"use client";
import Link from "next/link";
import { CiUser } from "react-icons/ci";
import Cart from "./Cart";
import { useSession } from "next-auth/react";
import Image from "next/image";

function User() {
  const { data: session } = useSession();

  return (
    <>
      <Link
        href={session ? "/myacc" : "/login"}
        className="flex items-center gap-3 cursor-pointer"
      >
        {session === undefined && (
          <>
            <div className="h-6 w-6 rounded-full loading--background"></div>
            <div>
              <div className="w-14 h-2 rounded-lg loading--background mb-1.5"></div>
              <div className="w-14 h-3 rounded-lg loading--background" />
            </div>
          </>
        )}
        {session !== undefined && (
          <>
            {session?.user ? (
              <Image
                src={session.user.image}
                alt="User Image"
                height={24}
                width={24}
                className="rounded-full"
              />
            ) : (
              <CiUser className="text-gray-400" size={20} />
            )}
            <div>
              <p className="text-xs text-gray-400">Account</p>
              <div className="text-sm font-semibold">
                {session?.user ? session.user.name!.split(" ")[0] : "Log in"}
              </div>
            </div>
          </>
        )}
      </Link>
      <Cart />
    </>
  );
}

export default User;
