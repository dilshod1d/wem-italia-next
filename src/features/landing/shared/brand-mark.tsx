import { memo, useId, useMemo } from "react";
import Link from "next/link";
import {
  BRAND_MARK_DARK_SVG,
  BRAND_MARK_LIGHT_SVG,
} from "./brand-mark-svgs";
import cx from "../utils/cx";

interface BrandMarkProps {
  className?: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}

function scopeSvgMarkup(svgMarkup: string, idPrefix: string) {
  const idMap = new Map<string, string>();

  let scopedMarkup = svgMarkup.replace(/\bid="([^"]+)"/g, (_, id: string) => {
    const scopedId = `${idPrefix}-${id}`;

    idMap.set(id, scopedId);
    return `id="${scopedId}"`;
  });

  for (const [id, scopedId] of idMap) {
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    scopedMarkup = scopedMarkup
      .replace(new RegExp(`url\\(#${escapedId}\\)`, "g"), `url(#${scopedId})`)
      .replace(
        new RegExp(`xlink:href="#${escapedId}"`, "g"),
        `xlink:href="#${scopedId}"`,
      )
      .replace(
        new RegExp(`xlinkHref="#${escapedId}"`, "g"),
        `xlinkHref="#${scopedId}"`,
      )
      .replace(new RegExp(`href="#${escapedId}"`, "g"), `href="#${scopedId}"`);
  }

  return scopedMarkup;
}

export const BrandMark = memo(function BrandMark({
  className = "",
  theme = "light",
  onClick,
}: BrandMarkProps) {
  const instanceId = useId().replace(/:/g, "");
  const logoMarkup = useMemo(
    () =>
      scopeSvgMarkup(
        theme === "light" ? BRAND_MARK_LIGHT_SVG : BRAND_MARK_DARK_SVG,
        `brand-mark-${instanceId}`,
      ),
    [instanceId, theme],
  );

  return (
    <Link href="/" aria-label="Go to homepage" scroll={false} onClick={onClick}>
      <span
        className={cx(
          "relative block h-[56px] w-[140px] sm:h-[72px] sm:w-[180px] lg:h-[100px] lg:w-[250px] [&>svg]:h-full [&>svg]:w-full",
          className,
        )}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: logoMarkup }}
      />
    </Link>
  );
});
