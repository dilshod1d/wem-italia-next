import React from "react";

interface GiovanniIconProps {
  className?: string;
}

function GiovanniIcon({ className = "h-auto w-40" }: GiovanniIconProps) {
  return (
    <svg
      viewBox="0 0 272 272"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="271.746" height="271.746" fill="url(#pattern0_7_624)" />
      <defs>
        <pattern
          id="pattern0_7_624"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_7_624" transform="scale(0.000494071)" />
        </pattern>
        <image
          id="image0_7_624"
          width="2024"
          height="2024"
          preserveAspectRatio="none"
          xlinkHref="/landing/giovanni-mark.png"
        />
      </defs>
    </svg>
  );
}

export default GiovanniIcon;
