import Image from "next/image";

const JustGoHealthBlack = () => {
  return (
    <Image
      priority
      src="/logos/logo-black.png"
      alt="JustGo Health"
      className="bg-contain w-auto h-auto"
      width={180}
      height={40}
    />
  );
};

export default JustGoHealthBlack;
