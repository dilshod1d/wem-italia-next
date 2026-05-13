import Image from "next/image";
import Link from "next/link";
import cx from "../utils/cx";

interface BrandMarkProps {
  className?: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}

export function BrandMark({
  className = "",
  theme = "light",
  onClick,
}: BrandMarkProps) {
  const logoSrc = theme === "light" ? "/logo-light.svg" : "/logo-dark.svg";

  return (
    <Link href="/" aria-label="Go to homepage" scroll={false} onClick={onClick}>
      <div
        className={cx(
          "relative h-[56px] w-[140px] sm:h-[72px] sm:w-[180px] lg:h-[100px] lg:w-[250px]",
          className,
        )}
      >
        <Image
          src={logoSrc}
          alt="WEM Italia logo"
          fill
          unoptimized
          priority
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 1024px) 250px, (min-width: 640px) 180px, 140px"
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>
    </Link>
  );
}
