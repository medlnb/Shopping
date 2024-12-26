import Promotions from "@components/Promotions";
import { Suspense } from "react";

function Page() {
  const loading = (
    <div className="flex flex-col md:grid  md:grid-cols-6  gap-4 gap-y-2 max-w-[73rem] mx-auto">
      <div
        className={`row-span-2 col-span-4 h-96 w-full loading--background max-w-[73rem] mx-auto rounded-lg`}
      />
      <div
        className={`col-span-2 h-[11.6rem] w-full loading--background max-w-[73rem] mx-auto rounded-lg`}
      />
      <div
        className={`col-span-2 h-[11.6rem] w-full loading--background max-w-[73rem] mx-auto rounded-lg`}
      />
    </div>
  );
  return (
    <main>
      <section className="bg-[#e5eaf4] md:p-10 p-2">
        <Suspense fallback={loading}>
          <Promotions />
        </Suspense>
      </section>
    </main>
  );
}

export default Page;
