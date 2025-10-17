"use client";

interface BioStepProps {
  phoneNumber: string;
  bio: string;
  onChange: (field: "phoneNumber" | "bio", value: string) => void;
}

const BioStep = ({ phoneNumber, bio, onChange }: BioStepProps) => {
  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-extrabold text-center">Add Bio</h1>

      <div className="space-y-6">
        <div>
          <label className="text-xl font-semibold text-gray-700 mb-2 block">
            Office Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="Enter your office phone number"
            maxLength={10}
            className="w-full p-4 border-4 border-gray-300 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none"
          />
          <p className="text-sm text-gray-500 mt-2">
            This is private and will not be shared with anyone outside JustGo
            Health.
          </p>
        </div>

        <div>
          <label className="text-xl font-semibold text-gray-700 mb-2 block">
            Status
          </label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder="Introduce yourself to the world of mental health."
              maxLength={140}
              className="w-full p-4 border-4 border-green-600 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none resize-none h-32"
            />
            <span className="absolute top-2 right-2 text-sm text-gray-500">
              {bio.length}/140
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
