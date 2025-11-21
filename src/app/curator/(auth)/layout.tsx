import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IProps) => {
  return (
    <main className="flex w-full h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-500/30"></div>
      <div className="absolute inset-0 backdrop-blur-[120px]"></div>

      <section className="relative z-10 h-full bg-[url(/auth/lawyer.jpg)] bg-no-repeat bg-cover w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-blue-600/50 to-emerald-600/60"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        <div className="relative z-10 h-full flex flex-col justify-between text-white px-12 py-12">
          <div>
            <div className="inline-block p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Curator Portal
              </h1>
            </div>
            <p className="text-2xl font-medium leading-relaxed backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
              Manage and approve healthcare providers for the JustGo Health
              platform with advanced administration tools.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Key Features</h2>
            <ul className="space-y-4 text-xl">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Review provider applications
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Approve or reject providers
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Monitor provider status
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                Access detailed provider profiles
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 h-full w-1/2 overflow-y-auto">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
