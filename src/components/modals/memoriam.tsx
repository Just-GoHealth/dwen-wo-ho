import React from "react";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import Memoriam from "../memoriam";

const contributors = [
  {
    name: "DR. NATHANIEL CUDJOE,",
    description:
      "MD, reviewed the screening tool and gave us directions on the critical symptoms of suicide. He also attended and led workshops for thousands of students.",
  },
  {
    name: "DR. NATHANIEL CUDJOE,",
    description:
      "MD, reviewed the screening tool and gave us directions on the critical symptoms of suicide. He also attended and led workshops for thousands of students.",
  },
  {
    name: "DR. NATHANIEL CUDJOE,",
    description:
      "MD, reviewed the screening tool and gave us directions on the critical symptoms of suicide. He also attended and led workshops for thousands of students.",
  },
];

const MemoriamModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <div className="max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto">
        <Memoriam showQuote={false} />

        <hr className="border-gray-300 mb-6" />

        <div className="text-center text-3xl md:text-4xl font-light mb-8">
          Made With Love <span className="text-[#D94A54]">❤️</span> by these Humans
        </div>

        <div className="divide-y divide-gray-300">
          {contributors.map((c, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row py-4 md:py-6 gap-2 md:gap-0"
            >
              <div className="md:w-1/3 font-bold text-[#8B5CB1] text-lg md:text-xl uppercase text-left md:text-right pr-4">
                {c.name}
              </div>
              <div className="md:w-2/3 text-black text-base md:text-lg text-left pl-0 md:pl-4">
                {c.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default MemoriamModal;
