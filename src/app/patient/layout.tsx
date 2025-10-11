import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
const Layout = ({ children }: IProps) => {
  return (
    <main className="flex w-full h-screen">
      <section className="relative h-full bg-green-400 bg-[url(/auth/man.jpg)] bg-no-repeat bg-cover px-10 pb-10 w-1/2">
        <div className="h-full flex flex-col items-center justify-between">
          <h1 className="text-4xl font-bold mt-10 text-white">Behind The Science</h1>
          <div className="py-2 px-4 right-10 rounded-lg bg-black/20">
            <h3 className="text-xl font-bold text-white">Dr. Francis Kwadwo Yeboah</h3>
            <p className="text-xl font-medium">Graduated top of his class</p>
            <p className="text-xl font-medium">GPA of 4.0</p>
            <p className="text-xl font-medium">Clinical Psychologist</p>
          </div>
        </div>
      </section>
      <section className="h-full w-1/2 pt-10 pb-5 overflow-hidden">
        {children}
      </section>
    </main>
  );
};

export default Layout;
