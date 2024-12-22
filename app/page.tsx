import Promotions from "@components/Promotions";
import { Suspense } from "react";

function Page() {
  return (
    <main>
      <Suspense>
        <Promotions />
      </Suspense>
    </main>
  );
}

export default Page;
