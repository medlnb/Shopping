"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function Nav() {
  const t = useTranslations("manageProducts");
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const navs = [
    { label: t("myProducts"), link: "/manageproducts" },
    {
      label: t("addProduct"),
      link: "/manageproducts/product",
    },
  ];

  const pathname = usePathname();
  return (
    <nav className="max-w-[73rem] mx-auto flex items-center gap-4 md:text-base text-sm font-semibold text-gray-600 py-3 border-b">
      {navs.map((nav) => (
        <Link
          key={nav.link}
          href={nav.link}
          className={`relative underlined ${
            pathname === nav.link && !productId ? "text-black font-bold" : ""
          } `}
        >
          {nav.label}
        </Link>
      ))}
    </nav>
  );
}

export default Nav;
