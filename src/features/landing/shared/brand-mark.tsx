import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import cx from "../utils/cx";

interface BrandMarkProps {
  className?: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}

const BRAND_MARK_ASSETS = {
  light: {
    src: "/landing/brand-mark-light.svg",
    width: 364,
    height: 79,
  },
  dark: {
    src: "/landing/brand-mark-dark.svg",
    width: 2052,
    height: 451,
  },
} as const;

export const BrandMark = memo(function BrandMark({
  className = "",
  theme = "light",
  onClick,
}: BrandMarkProps) {
  const asset = BRAND_MARK_ASSETS[theme];

  return (
    <Link href="/" aria-label="Go to homepage" scroll={false} onClick={onClick}>
      <span
        className={cx(
          "relative block h-[56px] w-[140px] sm:h-[72px] sm:w-[180px] lg:h-[100px] lg:w-[250px] [&>img]:h-full [&>img]:w-full",
          className,
        )}
        aria-hidden="true"
      >
        <Image
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt=""
          unoptimized
          className="block"
        />
      </span>
    </Link>
  );
});
