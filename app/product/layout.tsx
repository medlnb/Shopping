import { Suspense } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
}

export default Layout;
