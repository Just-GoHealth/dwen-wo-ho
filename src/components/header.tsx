"use client";
import { NAV_ITEMS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { AlignRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import WidthConstraint from "./ui/width-constraint";
import { Button } from "./ui/button";
import { ROUTES } from "@/constants/routes";

const MobileMenu = ({ check }: { check: boolean }) => {
  const pathname = usePathname();
  return (
    <WidthConstraint className="w-full">
      <AnimatePresence>
        {check && (
          <motion.nav
            key="nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <ul className="flex flex-col gap-4 pt-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`font-[600] ${
                      pathname === item.path ? "text-[#2BA36A] underline" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </WidthConstraint>
  );
};

const Header = ({ className, logo }: { className?: string; logo?: string }) => {
  const pathname = usePathname();
  const [check, setCheck] = useState(false);
  const navRef = useRef<HTMLHeadingElement | null>(null);
  const [, setIsScrolling] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setCheck(false);
    }
  };

  useEffect(() => {
    setCheck(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setCheck(false);
      if (window.scrollY === 0) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();

  const handleGetStarted = () => {
    if (pathname === "/providers") {
      router.push(ROUTES.provider.auth);
    } else {
      router.push(ROUTES.patient.checkEmail);
    }
  };

  return (
    <header
      className={`py-4 pr-6 flex flex-col items-center z-[50] overflow-clip fixed top-0 w-screen text-black ${className} bg-gray-100`}
      ref={navRef}
    >
      <WidthConstraint className="flex w-full items-center justify-between gap-4">
        <Link href="/">
          <Image
            src={logo || "/logos/logo-black.png"}
            alt="dwen-wo-ho logo"
            width={150}
            height={60}
          />
        </Link>
        <nav
          className={`hidden lg:absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] lg:flex`}
        >
          <ul className="gap-8 flex nav-link ">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`font-[600] underline-offset-4 ${
                    pathname === item.path ? "text-[#2BA36A] underline" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}{" "}
          </ul>
        </nav>
        <button className="flex lg:hidden" onClick={() => setCheck(!check)}>
          {!check ? <AlignRight /> : <X />}
        </button>
        <div className="hidden lg:flex gap-4 items-center">
          {/* <Link href={ROUTES.curator.signIn}>
            <Button
              variant="outline"
              className="text-[#955aa4] border-[#955aa4] hover:bg-[#955aa4] hover:text-white"
            >
              Curator Portal
            </Button>
          </Link> */}
          <Button
            onClick={handleGetStarted}
            className="bg-gray-300 text-black hover:bg-gray-300 "
          >
            Get Started
          </Button>
        </div>
      </WidthConstraint>
      <MobileMenu check={check} />
    </header>
  );
};

export default Header;
