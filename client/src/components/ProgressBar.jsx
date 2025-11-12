import React from 'react';

/**
 * ProgressBar
 * - Keeps backward compatibility with existing props:
 *   - progress: number (0-100)
 *   - color: Tailwind bg- class (e.g. "bg-emerald-600")
 *   - status: string (used for a11y label only)
 * - No inline % text to avoid redundancy (your parent already shows it).
 * - Light theme, subtle track and border, smooth animation.
 */
const ProgressBar = ({
  progress = 0,
  color = 'bg-emerald-600',
  status = 'progress',
  compact = false,          // optional: slightly thinner bar
  className = ''            // optional: extra classes for outer wrapper
}) => {
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));
  const height = compact ? 'h-2' : 'h-2.5';

  return (
    <div
      className={`relative w-full ${className}`}
      role='progressbar'
      aria-label={status || 'progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      title={`${pct}%`}
    >
      <div className={`w-full ${height} rounded-full bg-slate-100 border border-slate-200 overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
