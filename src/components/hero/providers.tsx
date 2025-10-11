"use client";

import React, { useEffect, useState } from "react";
import Memoriam from "../memoriam";
import WidthConstraint from "../ui/width-constraint";
import Image from "next/image";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import Header from "../header";

const ProvidersHero = () => {
  const texts = [
    "Psychologists",
    "Counsellors",
    "Therapists",
    "Psychiatrists",
    "Academic Coaches",
    "Providers",
  ];

  const colors = ["#2BA36A", "#8B5CB1", "#D94A54", "#8B5CB1", "#2BA36A"];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

  const router = useRouter()
  return (
    <>
    <Header className="bg-gray-200" logo="/logos/logo-purple.png" />
    <section className="bg-white">
      <div className="relative h-[600px] lg:h-[728px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/people-painting.jpeg"
            alt="Art studio with people painting"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <WidthConstraint>
            <div className="max-w-5xl mx-auto space-y-20">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                    <span className="text-white">Calling all</span>{" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTextIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ color: colors[currentTextIndex] }}
                      className="inline-block"
                    >
                      {texts[currentTextIndex]}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 font-medium max-w-3xl mx-auto">
                  to bring personalized mental healthcare closer to college
                  students.
                </p>
              </div>
              <Button
                onClick={() => router.push(ROUTES.provider.checkEmail)}
                className="bg-gray-200 text-[#D94A54] hover:bg-gray-300 px-8"
              >
                Get Started
              </Button>
            </div>
          </WidthConstraint>
        </div>
      </div>

      <Memoriam showQuote={true} />
    </section>
    </>
  );
};

export default ProvidersHero;
