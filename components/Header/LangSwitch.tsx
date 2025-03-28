"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function LangSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const lang = pathname.startsWith("/en") ? "en" : "fr";

  const HandleSwitch = (lang: "en" | "fr") => {
    const queryString = searchParams.toString();
    const newPath =
      lang === "en"
        ? pathname.replace("/fr", "/en")
        : pathname.replace("/en", "/fr");
    const newUrl = queryString ? `${newPath}?${queryString}` : newPath;
    replace(newUrl);
  };

  const langs = [
    {
      label: "En",
      value: "en",
    },
    {
      label: "Fr",
      value: "fr",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {langs.map((item, key) => (
        <button
          key={key}
          onClick={() => HandleSwitch(item.value as "en" | "fr")}
          className={`w-7 h-7 ${
            lang === item.value
              ? "font-semibold bg-blue-light rounded-full shadow-md text-white"
              : "text-gray-7 font-medium"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default LangSwitch;
