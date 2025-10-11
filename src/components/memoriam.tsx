"use client";

import React from "react";
import { motion, easeOut } from "framer-motion";
import WidthConstraint from "./ui/width-constraint";

interface MemoriamProps {
  className?: string;
  showQuote?: boolean;
}

const Memoriam: React.FC<MemoriamProps> = ({ className = "", showQuote = true }) => {
  const memoriamList = [
    { name: "Nicholas Kumi Dankwa", university: "UEW", time: "3 months ago" },
    { name: "Joana Deladem Yabani", university: "KNUST", time: "5 months ago" },
    { name: "Rita Anane", university: "UEW", time: "2 years ago" },
    { name: "Adwoa A. Anyinadu-Antwi", university: "KNUST", time: "8 years ago" },
    { name: "Jennifer Nyarko", university: "UG", time: "8 years ago" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const quoteVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
        delay: 0.5,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <WidthConstraint className="max-w-[1000px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px", amount: 0.3 }}
          className={`${className} space-y-10`}
        >
          <motion.div variants={titleVariants} className="text-center">
            <h2 className="text-[#D94A54] text-3xl font-bold">
              In Memoriam.{" "}
              <span className="text-gray-700">Their lives are enough for us to act.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div variants={containerVariants} className="space-y-6">
              {memoriamList.map((person, index) => (
                <motion.div
                  key={index}
                  variants={listItemVariants}
                  className="flex items-center gap-4"
                >
                  <div className="h-full">
                    <div className="w-1 rounded-l-xl h-15 lg:h-10 bg-[#D94A54]" />
                  </div>
                  <div className="text-gray-800 flex flex-col lg:flex-row gap-2 text-lg">
                    <p className="font-semibold">{person.name},</p>
                    <p className="text-gray-600">
                      {person.university}, {person.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {showQuote && (
              <motion.div
                variants={quoteVariants}
                className="flex flex-col justify-center"
              >
                <blockquote className="text-[#D94A54] text-2xl lg:text-4xl font-bold text-center leading-relaxed mb-6">
                  &ldquo;We all cried the same tears on different cheeks.&rdquo;
                </blockquote>
                <cite className="font-medium text-base text-center">
                  ~ Dave (We&apos;re all alone in this together Album)
                </cite>
              </motion.div>
            )}
          </div>
        </motion.div>
      </WidthConstraint>
    </section>
  );
};

export default Memoriam;
