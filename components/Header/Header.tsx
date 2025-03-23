"use client";
import Link from "next/link";
import { BsTelephone } from "react-icons/bs";
import Filters from "./Filters";
import User from "./User";
import Search from "./Search";
import LangSwitch from "./LangSwitch";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

function Header() {
  const t = useTranslations("Header");
  const [toggle, setToggle] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-20">
      <section className="border-b border-gray-5 p-4">
        <div className="max-w-[73rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex justify-between items-center w-full md:w-auto gap-10">
              <Link className="text-3xl font-bold text-start w-full" href="/">
                Shopping
              </Link>
              <Suspense>
                <LangSwitch />
              </Suspense>
            </div>
            <Search toggle={toggle} setToggle={setToggle} />
            <div className="flex items-center justify-center gap-4 w-full md:w-auto whitespace-nowrap">
              <Link
                href="/contact"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BsTelephone size={20} />
                <div>
                  <p className="text-xs text-gray-7">{t("support")}</p>
                  <p className="text-sm font-semibold">+213 549 773 117</p>
                </div>
              </Link>
              <div className="h-6 w-[0.5px] bg-gray-400" />

              <User />
            </div>
          </div>
        </div>
      </section>

      <Filters toggle={toggle} />
    </header>
  );
}

export default Header;
