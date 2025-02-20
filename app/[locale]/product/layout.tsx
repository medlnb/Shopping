import { Suspense } from "react";

const loader = (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-16 p-2 py-10 max-w-[72rem] mx-auto">
    <div className="flex-1 h-96 loading--background rounded-lg" />
    <div className="flex-1">
      <div className="loading--background rounded-2xl w-72 h-7" />
      <div className="loading--background rounded-2xl w-44 h-5 mt-3" />
      <div className="flex items-center mt-3 gap-3">
        <div className="loading--background rounded-2xl w-24 h-4" />
        /
        <div className="loading--background rounded-2xl w-20 h-3 mt-1" />
      </div>
      <div className="flex items-center mt-8 gap-3">
        <b className="text-xl font-bold text-gray-800">Prices:</b>
        <div className="loading--background rounded-2xl w-44 h-4" />
      </div>

      <div className="border cursor-pointer duration-150 rounded-md p-1 px-2 mt-2 relative hover:bg-gray-200 hover:border-gray-600 border-gray-400 bg-gray-100">
        <div className="absolute -top-2 -right-2 rounded-full p-0.5 text-white flex items-center justify-center text-sm px-2">
          <div className="loading--background rounded-2xl w-16 h-4" />
        </div>
        <div className="text-lg font-semibold text-gray-600 flex items-center gap-2">
          <div className="loading--background rounded-2xl w-16 h-4" /> -
          <div className="loading--background rounded-2xl w-16 h-4" />
          Dzd
        </div>
        <div className="loading--background rounded-2xl w-5/6 h-3" />
      </div>
    </div>
  </section>
);

function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={loader}>{children}</Suspense>;
}

export default Layout;
