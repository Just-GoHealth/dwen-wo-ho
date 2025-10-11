"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Memoriam from "../memoriam";
import WidthConstraint from "../ui/width-constraint";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const PatientsHero = () => {
  const router = useRouter();
  
  const texts = [
    "Boost Your CWA/GPA 📈",
    "Lower Stress & Anxiety 😌",
    "Feel Happier 😊",
    "Ease Depression 🌧",
    "Build Better Relationships 💞",
    "Improve Your Roomie Vibes 🏡",
  ];

  const colors = ["#2BA36A", "#8B5CB1", "#D94A54", "#2b3990", "#8B5CB1", "#2BA36A"];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  return (
    <section className="bg-white py-10">
      <WidthConstraint>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-16 lg:py-24"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-5 items-center"
          >
            <motion.div
              variants={itemVariants}
              className="space-y-4 flex gap-4 flex-col text-center"
            >
              <h1 className="text-4xl lg:text-5xl leading-0 font-bold text-[#2BA36A]">
                Dwen Wo Ho
              </h1>
              <p className="text-lg lg:text-xl font-medium leading-relaxed lg:max-w-[400px]">
                It&apos;s never been this easy to take care of your own mental health, and
              </p>
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="aspect-video bg-gray-50 rounded-lg overflow-hidden"
            >
              <Image
                src="/hero/lady-painting.jpeg"
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-5 items-center"
          >
            <motion.div
              variants={imageVariants}
              className="aspect-video bg-gray-50 rounded-lg overflow-hidden"
            >
              <Image
                src="/hero/woman-painting.jpeg"
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-5 py-4 text-center">
              <div className="flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ color: colors[currentTextIndex] }}
                    className="text-2xl lg:text-3xl font-bold absolute"
                  >
                    {texts[currentTextIndex]}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <p className="text-lg lg:text-xl font-medium leading-relaxed">
                living your best life in college.
              </p>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => router.push(ROUTES.patient.checkEmail)}
                  className="bg-gray-200 text-[#D94A54] hover:bg-gray-300 px-8"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </WidthConstraint>
      <Memoriam showQuote={true} />
    </section>
  );
};

export default PatientsHero;
