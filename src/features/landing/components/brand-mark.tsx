import Image from "next/image";

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.svg"
        alt="WEM Italia logo"
        width={250}
        height={100}
        className="object-contain"
        priority
      />
    </div>
  );
}
