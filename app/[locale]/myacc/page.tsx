import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const session = await getServerSession();
  const t = await getTranslations("myacc");
  return (
    <div
      className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9 px-4 sm:px-7 xl:px-10`}
    >
      <p className="text-dark">
        <b>{t("hello")}</b> {session?.user.name}
      </p>

      <p className="text-custom-sm mt-4">{t("welcome")}</p>
    </div>
  );
};

export default Page;
