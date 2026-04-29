import Image from "next/image";
import Link from "next/link";

interface BrandMarkProps {
  className?: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BrandMark({
  className = "",
  theme = "light",
  onClick,
}: BrandMarkProps) {
  return (
    <Link href="/" aria-label="Go to homepage" scroll={false} onClick={onClick}>
      <div
        className={cx(
          "relative h-[56px] w-[140px] sm:h-[72px] sm:w-[180px] lg:h-[100px] lg:w-[250px]",
          className,
        )}
      >
        <Image
          src="/logo-light.svg"
          alt="WEM Italia logo"
          loading="eager"
          fill
          sizes="(min-width: 1024px) 250px, (min-width: 640px) 180px, 140px"
          className={cx(
            "object-contain transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            theme === "light" ? "opacity-100" : "opacity-0",
          )}
        />
        <Image
          src="/logo-dark.svg"
          alt="WEM Italia logo"
          fill
          sizes="(min-width: 1024px) 250px, (min-width: 640px) 180px, 140px"
          className={cx(
            "object-contain transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            theme === "dark" ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </Link>
  );
}
