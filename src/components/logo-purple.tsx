import Image from "next/image";
import Link from "next/link";

const JustGoHealth = () => {
  return (
    <Link href="/">
      <Image
        priority
        src="/logos/logo-purple.png"
        alt="JustGo Health"
        className="bg-contain w-auto h-auto"
        width={180}
        height={40}
      />
    </Link>
  );
};

export default JustGoHealth;
