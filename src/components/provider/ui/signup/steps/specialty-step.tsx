"use client";

import { useState } from "react";

interface SpecialtyStepProps {
  specialty: string;
  onChange: (field: "specialty", value: string) => void;
}

const specialties = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Academic Advisor",
  "Counsellor",
  "Mental Health Nurse",
  "Therapist",
  "Medical Doctor",
  "Peer Counselor",
  "Wellness Coach",
  "Career Counselor",
];

const SpecialtyStep = ({ specialty, onChange }: SpecialtyStepProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty);

  const handleSpecialtySelect = (specialty: string) => {
    // Toggle selection: if already selected, unselect it
    const newSelection = selectedSpecialty === specialty ? "" : specialty;
    setSelectedSpecialty(newSelection);
    onChange("specialty", newSelection);
  };

  return (
    <div className="space-y-8 px-11">
      <h1 className="text-5xl font-extrabold text-center ">Add Specialty</h1>
      <p className="text-xl font-medium text-gray-500 text-center -mt-5">
        Click to choose your specialty. You can add more than one later.
      </p>

      <div className="grid grid-cols-2 gap-3.5 max-w-2xl mx-auto">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => handleSpecialtySelect(specialty)}
            className={`p-4 rounded-full text-center font-bold text-lg transition-all duration-200 ${selectedSpecialty === specialty
                ? "bg-gray-500 text-white shadow-md active:scale-95"
                : "bg-gray-400 text-gray-300 hover:bg-gray-400/90 active:scale-95"
              }`}
          >
            {specialty}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyStep;
