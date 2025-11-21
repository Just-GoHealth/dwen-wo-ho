import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const CuratorLayout = ({ children }: IProps) => {
  return <main className="w-full min-h-screen">{children}</main>;
};

export default CuratorLayout;
