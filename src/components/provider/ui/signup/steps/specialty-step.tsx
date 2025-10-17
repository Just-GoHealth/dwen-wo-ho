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
    <div className="space-y-8">
      <h1 className="text-5xl font-extrabold text-center">Add Specialty</h1>
      <p className="text-xl text-gray-600 text-center">
        Click to choose your specialty. You can add more than one later.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => handleSpecialtySelect(specialty)}
            className={`p-4 rounded-full border-2 text-left transition-all duration-200 ${
              selectedSpecialty === specialty
                ? "border-[#955aa4] bg-purple-50 text-[#955aa4]"
                : selectedSpecialty
                ? "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                : "border-gray-300 bg-gray-100 hover:border-gray-400"
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
