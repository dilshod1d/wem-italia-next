interface BodyCopyTextProps {
  lines: readonly (string | null | undefined | false)[];
  className?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BodyCopyText({ lines, className }: BodyCopyTextProps) {
  const visibleLines = lines
    .map((line) => (typeof line === "string" ? line.trim() : line))
    .filter((line): line is string => Boolean(line));

  if (!visibleLines.length) return null;

  return (
    <p className={cx("text-body whitespace-pre-line", className)}>
      {visibleLines.join("\n")}
    </p>
  );
}
