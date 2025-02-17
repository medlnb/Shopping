import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession();
  return (
    <div
      className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9 px-4 sm:px-7 xl:px-10`}
    >
      <p className="text-dark">
        <b>Hello</b> {session?.user.name}
      </p>

      <p className="text-custom-sm mt-4">
        From your account dashboard you can view your recent orders, manage your
        shipping and billing addresses, and edit your password and account
        details.
      </p>
    </div>
  );
};

export default Page;
