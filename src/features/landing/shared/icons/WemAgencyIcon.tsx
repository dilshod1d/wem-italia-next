import React from "react";

interface WemAgencyIconProps {
  className?: string;
}

function WemAgencyIcon({ className = "h-auto w-40" }: WemAgencyIconProps) {
  return (
    <svg
      viewBox="0 0 272 272"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="271.746" height="271.746" fill="url(#pattern0_7_843)" />
      <defs>
        <pattern
          id="pattern0_7_843"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_7_843"
            transform="translate(0 0.194175) scale(0.00242718)"
          />
        </pattern>
        <image
          id="image0_7_843"
          width="412"
          height="252"
          preserveAspectRatio="none"
          xlinkHref="/landing/wem-agency-mark.png"
        />
      </defs>
    </svg>
  );
}

export default WemAgencyIcon;
