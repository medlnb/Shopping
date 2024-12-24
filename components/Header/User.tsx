import { getServerSession } from "next-auth";
import Link from "next/link";
import { CiUser } from "react-icons/ci";
import Cart from "./Cart";

async function User() {
  const session = await getServerSession();
  return (
    <>
      <div className="flex items-center gap-3 cursor-pointer">
        {session?.user?.image ? (
          <img src={session.user.image} className="h-6 w-6 rounded-full" />
        ) : (
          <CiUser size={20} />
        )}
        <div>
          <p className="text-xs text-gray-400">Account</p>
          <div className="text-sm font-semibold">
            {session?.user ? (
              session.user.name!.split(" ")[0]
            ) : (
              <Link href="/login">Log in</Link>
            )}
          </div>
        </div>
      </div>
      {session?.user && <Cart />}
    </>
  );
}

export default User;