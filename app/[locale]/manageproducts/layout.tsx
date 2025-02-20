import { ReactNode, Suspense } from "react";
import Nav from "./Nav";

function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-gray-100 p-1">
      <Suspense>
        <Nav />
      </Suspense>
      {children}
    </main>
  );
}

export default Layout;
