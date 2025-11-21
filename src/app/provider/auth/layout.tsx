import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <main className="flex flex-col lg:flex-row w-full h-screen">
      <section className="relative h-full bg-green-400 bg-[url(/auth/lawyer.jpg)] hidden lg:block bg-no-repeat bg-cover text-white px-10 pb-10 w-1/2">
        <div className="h-full flex flex-col items-center justify-between">
          <h1 className="text-4xl font-bold mt-10">Behind The Science</h1>
          <h2 className="text-2xl text-center font-medium">
            &quot;I wish I could hit pause on my life, just
            <br /> for now, and return when the world feels right again.😔&quot;
          </h2>
        </div>
        <div className="absolute top-[30%] p-2 right-10 rounded-lg bg-gray-600/50">
          <h3 className="text-xl font-bold">Amanda Gorman</h3>
          <p className="text-xl font-medium">Law Student</p>
        </div>
      </section>
      <section className="h-full w-full lg:w-1/2 overflow-y-auto">
        {children}
      </section>
    </main>
  );
};

export default Layout;
