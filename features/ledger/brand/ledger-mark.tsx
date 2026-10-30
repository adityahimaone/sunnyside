/**
 * Ledger mark — the grid holds, one tile floats.
 *
 * Constructed track: three filled cells and one outlined cell lifted off the
 * grid. It reads at 16px because the gap is 4 units on a 24-unit box (2.6px at
 * favicon size), and the outline is the only unfilled cell.
 */
export function LedgerMark({
  className,
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="8" rx="2" width="8" x="1" y="1" />
      <rect fill="currentColor" height="8" rx="2" width="8" x="15" y="1" />
      <rect fill="currentColor" height="8" rx="2" width="8" x="1" y="15" />
      <rect
        height="7"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        width="7"
        x="15.5"
        y="15.5"
      />
    </svg>
  );
}
