"use client";

interface BioStepProps {
  phoneNumber: string;
  bio: string;
  onChange: (field: "phoneNumber" | "bio", value: string) => void;
}

const BioStep = ({ phoneNumber, bio, onChange }: BioStepProps) => {
  return (
    <div className="space-y-8 px-20 -mt-20">
      <div className="space-y-6">
        <div>
          <div className="relative">
              <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="Office Phone Number"
            maxLength={10}
            className="w-full p-4 border-4 border-gray-400 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none"
          />
          <p className="text-lg font-medium text-gray-400 absolute right-4 top-1/2 -translate-y-1/2">
  {10 - phoneNumber.length}
</p>
          </div>
          <p className="text-lg text-center font-medium text-gray-500 mt-2">
            This is private and will not be shared with anyone outside JustGo
            Health.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-lg ml-4 font-semibold text-gray-700 mb-1 block">
              Status
            </label>
            <span className="text-sm text-gray-500">
              {140 - bio.length}
            </span>
          </div>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder=""
              maxLength={140}
              className="w-full p-4 border-4 border-green-600 rounded-xl text-lg bg-gray-100 focus:border-[#955aa4] focus:outline-none resize-none h-36"
            />
            <p className="text-lg text-center font-medium text-gray-500 mt-2">
            Introduce yourself to the world of mental health.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
