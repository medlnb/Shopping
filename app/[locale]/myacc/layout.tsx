"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Nav from "./Nav";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const { data: session } = useSession();
  return (
    <main className="bg-gray-100">
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7">
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
                    {session ? (
                      <Image
                        src={session?.user.image}
                        alt="user"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="h-16 w-16 loading--background rounded-full"></div>
                    )}
                  </div>

                  {session ? (
                    <div>
                      <p className="font-medium text-dark mb-0.5">
                        {session.user.name}
                      </p>
                      <p className="text-custom-xs">
                        0{session.user.phoneNumber}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="h-4 w-30 loading--background rounded-lg mb-3"></div>
                      <div className="h-3 w-20 loading--background rounded-lg"></div>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-7 xl:p-9">
                  <Nav />
                </div>
              </div>
            </div>

            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
