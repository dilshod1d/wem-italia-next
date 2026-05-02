"use client";

interface CinematicIndicatorProps {
  isVisible: boolean;
}

export default function CinematicIndicator({
  isVisible,
}: CinematicIndicatorProps) {
  return (
    <div
      className={`fixed inset-0 z-[50] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="wem-loader-line" />
    </div>
  );
}
