import { Suspense } from "react";
import NewArrival from "./NewArrival";
import Hero from "@components/Hero/Hero";
import HeroFeature from "@components/Hero/HeroFeature";
import Image from "next/image";
import heroBg from "@public/hero/hero-bg.png";
import Categories from "@components/Categories";

function Page() {
  const loading = (
    <>
      <div className="xl:max-w-[757px] w-full">
        <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
          <Image
            src={heroBg}
            alt="hero bg shapes"
            className="absolute right-0 bottom-0 -z-1"
            width={534}
            height={520}
          />
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  ## %
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <div className="mb-3 loading--background h-6 rounded-xl"></div>

              <div className="mb-1 w-40 loading--background h-3 rounded-lg"></div>
              <div className="mb-3 w-30 loading--background h-3 rounded-lg"></div>

              <p className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10">
                Shop Now
              </p>
            </div>

            {/* <LoadImageClient
              Url={product.image}
              Css="h-90 w-90 object-contain rounded-lg mx-auto "
            /> */}
          </div>
        </div>
      </div>
      <div className="xl:max-w-[393px] w-full">
        <div className="flex flex-col sm:flex-row xl:flex-col justify-between h-full gap-5">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="w-full relative rounded-[10px] bg-white p-4 sm:p-7 flex-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="max-w-[153px] loading--background bg-dark h-6 rounded-lg mb-13"></div>

                  <div>
                    <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                      limited time offer
                    </p>
                    <span className="whitespace-nowrap">
                      <div className="loading--background h-4 rounded-lg ml-2 bg-dark-4 line-through"></div>
                      <div className="loading--background h-4 rounded-lg bg-red mt-2"></div>
                    </span>
                  </div>
                </div>

                {/* <LoadImage
                Url={product.image}
                Css="h-32 w-40 object-contain rounded-lg mx-auto "
              /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <main>
      <section className="overflow-hidden pb-10 lg:pb-12 xl:pb-15 pt-10 bg-[#E5EAF4]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap gap-5">
            <Suspense fallback={loading}>
              <Hero />
            </Suspense>
          </div>
        </div>
        <HeroFeature />
      </section>
      <Categories />

      <NewArrival />
    </main>
  );
}

export default Page;
