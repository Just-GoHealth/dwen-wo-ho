"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  const pathname = usePathname();

  // Define auth pages that should show the background image
  const authPages = [
    "/provider/signin",
    "/provider/signup",
    "/provider/check-email",
    "/provider/verify-password-reset",
    "/provider/new-password",
  ];

  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // For auth pages, show the split layout with background image
  if (isAuthPage) {
    return (
      <main className="flex flex-col lg:flex-row w-full h-screen">
        <section className="relative h-full bg-green-400 bg-[url(/auth/lawyer.jpg)] hidden lg:block bg-no-repeat bg-cover text-white px-10 pb-10 w-1/2">
          <div className="h-full flex flex-col items-center justify-between">
            <h1 className="text-4xl font-bold mt-10">Behind The Science</h1>
            <h2 className="text-2xl text-center font-medium">
              &quot;I wish I could hit pause on my life, just
              <br /> for now, and return when the world feels right
              again.😔&quot;
            </h2>
          </div>
          <div className="absolute top-[30%] p-2 right-10 rounded-lg bg-gray-600/50">
            <h3 className="text-xl font-bold">Amanda Gorman</h3>
            <p className="text-xl font-medium">Law Student</p>
          </div>
        </section>
        <section className="h-full w-full lg:w-1/2 pt-10 pb-5 overflow-y-auto">
          {children}
        </section>
      </main>
    );
  }

  // For profile and other pages, show full-width layout without background image
  return <main className="w-full min-h-screen">{children}</main>;
};

export default Layout;
