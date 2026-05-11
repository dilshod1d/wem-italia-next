import React from "react";

function MenuIcon({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 92 92"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="46" cy="46" r="46" fill="black" />

      <path
        d="M19 28H46.2593H73.5185"
        stroke="#6DBD45"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 46H46.2593H73.5185"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 64H46.2593H73.5185"
        stroke="#ED2D32"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MenuIcon;
