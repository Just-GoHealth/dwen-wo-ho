import Image from "next/image";

const JustGoHealth = () => {
  return (
    <Image
      priority
      src="/logos/logo-white.png"
      alt="JustGo Health"
      className="bg-contain w-auto h-auto"
      width={180}
      height={40}
    />
  );
};

export default JustGoHealth;
