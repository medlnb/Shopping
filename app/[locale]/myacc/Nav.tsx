"use client";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { CiLogout } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { TbShoppingCartCheck } from "react-icons/tb";
import { LuPackageOpen } from "react-icons/lu";

function Nav() {
  const { data: session } = useSession();
  const t = useTranslations("myacc");
  const pathname = usePathname();
  const navs = [
    {
      title: t("dashboard"),
      icon: <RxDashboard />,
      link: "/myacc",
    },
    {
      title: t("orders"),
      icon: <TbShoppingCartCheck />,
      link: "/myacc/orders",
    },
    {
      title: t("accountDetails"),
      icon: <LuUser />,
      link: "/myacc/accdetails",
    },
  ];

  if (session?.user.isAdmin)
    navs.push({
      title: t("manageProducts"),
      icon: <LuPackageOpen />,
      link: "/manageproducts",
    });

  return (
    <nav className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
      {navs.map((nav) => (
        <Link
          key={nav.title}
          href={nav.link}
          className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
            pathname === nav.link
              ? "text-white bg-blue"
              : "text-dark-2 bg-gray-1"
          }`}
        >
          {nav.icon}
          {nav.title}
        </Link>
      ))}

      <button
        onClick={() => signOut()}
        className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white `}
      >
        <CiLogout />
        {t("logout")}
      </button>
    </nav>
  );
}

export default Nav;
