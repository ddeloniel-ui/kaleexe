import React from 'react';

interface IconProps {
  className?: string;
}

export const PixelHeart: React.FC<IconProps & { filled?: boolean }> = ({
  className = 'w-4 h-4',
  filled = true,
}) => (
  <svg viewBox="0 0 11 10" className={className} shapeRendering="crispEdges" aria-hidden="true">
    <path
      d="M2 0h2v1h1v1h1V1h1V0h2v1h1v1h1v3h-1v1H9v1H8v1H7v1H6v1H5V9H4V8H3V7H2V6H1V5H0V2h1V1h1V0z"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 1}
    />
  </svg>
);

export const PixelSignalBars: React.FC<IconProps & { level?: number }> = ({
  className = 'w-4 h-3',
  level = 4,
}) => (
  <svg viewBox="0 0 14 10" className={className} shapeRendering="crispEdges" aria-hidden="true">
    <rect x="0" y="7" width="2" height="3" fill={level >= 1 ? 'currentColor' : 'rgba(26,36,23,0.22)'} />
    <rect x="3" y="5" width="2" height="5" fill={level >= 2 ? 'currentColor' : 'rgba(26,36,23,0.22)'} />
    <rect x="6" y="3" width="2" height="7" fill={level >= 3 ? 'currentColor' : 'rgba(26,36,23,0.22)'} />
    <rect x="9" y="1" width="2" height="9" fill={level >= 4 ? 'currentColor' : 'rgba(26,36,23,0.22)'} />
  </svg>
);

export const PixelBattery: React.FC<IconProps & { bars?: number }> = ({
  className = 'w-5 h-3',
  bars = 4,
}) => (
  <svg viewBox="0 0 18 10" className={className} shapeRendering="crispEdges" aria-hidden="true">
    <rect x="0" y="3" width="2" height="4" fill="currentColor" />
    <path d="M2 1h15v8H2V1zm1 1v6h13V2H3z" fill="currentColor" />
    {bars >= 4 && <rect x="4" y="3" width="2" height="4" fill="currentColor" />}
    {bars >= 3 && <rect x="7" y="3" width="2" height="4" fill="currentColor" />}
    {bars >= 2 && <rect x="10" y="3" width="2" height="4" fill="currentColor" />}
    {bars >= 1 && <rect x="13" y="3" width="2" height="4" fill="currentColor" />}
  </svg>
);

export const PixelEnvelope: React.FC<IconProps & { open?: boolean }> = ({
  className = 'w-4 h-3',
  open = false,
}) => (
  <svg viewBox="0 0 12 9" className={className} shapeRendering="crispEdges" aria-hidden="true">
    {open ? (
      <path
        d="M0 3h1V2h1V1h2V0h4v1h2v1h1v1h1v6H0V3zm1 1v4h10V4h-1v1H9v1H7v1H5V6H3V5H2V4H1zm2-2v1h2v1h2V3h2V2H8V1H4v1H3z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M0 0h12v9H0V0zm1 1v1h1v1h1v1h2v1h2V4h2V3h1V2h1V1H1zm0 2v5h10V3h-1v1H9v1H7v1H5V5H3V4H2V3H1z"
        fill="currentColor"
      />
    )}
  </svg>
);

export const PixelMusicNote: React.FC<IconProps> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 10 11" className={className} shapeRendering="crispEdges" aria-hidden="true">
    <path
      d="M4 0h6v3H9v5H8v1H6V8H5V7h1V6h2V2H5v7H4v1H2V9H1V8h1V7h2V0z"
      fill="currentColor"
    />
  </svg>
);

export const PixelLock: React.FC<IconProps & { unlocked?: boolean }> = ({
  className = 'w-3.5 h-3.5',
  unlocked = false,
}) => (
  <svg viewBox="0 0 10 11" className={className} shapeRendering="crispEdges" aria-hidden="true">
    {unlocked ? (
      <path d="M2 0h4v1h1v2H6V1H3v4h6v6H1V5h1V0zm2 7v2h2V7H4z" fill="currentColor" />
    ) : (
      <path d="M2 0h6v1h1v4h1v6H0V5h1V1h1V0zm1 1v4h4V1H3zm1 6v2h2V7H4z" fill="currentColor" />
    )}
  </svg>
);

export const PixelTeaCup: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 16 14" className={className} shapeRendering="crispEdges" aria-hidden="true">
    <rect x="4" y="0" width="1" height="2" fill="currentColor" opacity="0.6" />
    <rect x="7" y="1" width="1" height="2" fill="currentColor" opacity="0.6" />
    <rect x="10" y="0" width="1" height="2" fill="currentColor" opacity="0.6" />
    <path d="M2 4h10v6h-1v1H3v-1H2V4zm10 1h3v3h-1v1h-2V8h2V6h-2V5zM1 12h12v1H1v-1z" fill="currentColor" />
  </svg>
);

export const PixelNokiaHug: React.FC<IconProps & { active?: boolean }> = ({
  className = 'w-24 h-14',
  active = true,
}) => {
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (!active) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFrame(2);
      return;
    }

    const timer = window.setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 450);
    return () => window.clearInterval(timer);
  }, [active]);

  // 40x24 1-bit monochrome Nokia EMS-style hugging hands animation
  // Frame 0: arms reaching in, heart waiting
  // Frame 1: hands closing in around center
  // Frame 2: full warm embrace (left & right hands wrapping around with pixel fingers)
  // Frame 3: gentle squeeze + rising pixel hearts
  const reachOffset = frame === 0 ? 4 : frame === 1 ? 2 : 0;

  return (
    <svg
      viewBox="0 0 40 24"
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Nokia pixel hugging hands animation"
    >
      {/* Floating tiny pixel hearts on embrace frames (2 & 3) */}
      {frame >= 2 && (
        <>
          <path
            d={
              frame === 3
                ? 'M18 1h1v1h1V1h1v2h-1v1h-1V3h-1V1z'
                : 'M18 2h1v1h1V2h1v2h-1v1h-1V4h-1V2z'
            }
            fill="currentColor"
          />
          {frame === 3 && (
            <>
              <rect x="13" y="3" width="1" height="1" fill="currentColor" />
              <rect x="26" y="3" width="1" height="1" fill="currentColor" />
              <rect x="19" y="0" width="1" height="1" fill="currentColor" opacity="0.6" />
            </>
          )}
        </>
      )}

      {/* Center warm heart (visible when reaching, cradled inside hug on frames 2-3) */}
      {frame < 2 ? (
        <path
          d="M17 9h2v1h1v1h1v-1h1V9h2v1h1v3h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v-3h1V9z"
          fill="currentColor"
          opacity={frame === 0 ? 0.75 : 1}
        />
      ) : (
        /* Inner heart tucked warmly between the hugging hands */
        <path
          d="M18 8h1v1h2V8h1v1h1v2h-1v1h-1v1h-2v-1h-1v-1h-1V9h1V8z"
          fill="currentColor"
        />
      )}

      {/* LEFT ARM & WRAPPING HAND */}
      <g transform={`translate(${-reachOffset}, 0)`}>
        {/* Left sleeve cuff */}
        <rect x="1" y="10" width="3" height="8" fill="currentColor" />
        <rect x="2" y="11" width="1" height="6" fill="#A1B6A3" />
        {/* Left forearm extending right */}
        <rect x="4" y="11" width="7" height="6" fill="currentColor" />
        <rect x="5" y="12" width="6" height="4" fill="#A1B6A3" />
        {/* Left hand / palm wrapping across */}
        <rect x="11" y="10" width="6" height="8" fill="currentColor" />
        <rect x="11" y="11" width="5" height="6" fill="#A1B6A3" />
        {/* Left pixel thumb */}
        <rect x="12" y="9" width="3" height="1" fill="currentColor" />
        {/* Left curled pixel fingers hugging the right side */}
        {frame >= 2 ? (
          <>
            <rect x="17" y="11" width="4" height="1" fill="currentColor" />
            <rect x="17" y="13" width="5" height="1" fill="currentColor" />
            <rect x="17" y="15" width="4" height="1" fill="currentColor" />
            <rect x="17" y="17" width="3" height="1" fill="currentColor" />
            {/* Squeeze knuckle highlight */}
            <rect x="16" y="12" width="1" height="4" fill="currentColor" />
          </>
        ) : (
          <>
            <rect x="17" y="10" width="3" height="1" fill="currentColor" />
            <rect x="17" y="12" width="3" height="1" fill="currentColor" />
            <rect x="17" y="14" width="3" height="1" fill="currentColor" />
            <rect x="17" y="16" width="2" height="1" fill="currentColor" />
          </>
        )}
      </g>

      {/* RIGHT ARM & WRAPPING HAND */}
      <g transform={`translate(${reachOffset}, 0)`}>
        {/* Right sleeve cuff */}
        <rect x="36" y="10" width="3" height="8" fill="currentColor" />
        <rect x="37" y="11" width="1" height="6" fill="#A1B6A3" />
        {/* Right forearm extending left */}
        <rect x="29" y="11" width="7" height="6" fill="currentColor" />
        <rect x="29" y="12" width="6" height="4" fill="#A1B6A3" />
        {/* Right hand / palm wrapping across */}
        <rect x="23" y="10" width="6" height="8" fill="currentColor" />
        <rect x="24" y="11" width="5" height="6" fill="#A1B6A3" />
        {/* Right pixel thumb */}
        <rect x="25" y="9" width="3" height="1" fill="currentColor" />
        {/* Right curled pixel fingers hugging the left side */}
        {frame >= 2 ? (
          <>
            <rect x="19" y="11" width="4" height="1" fill="currentColor" opacity="0.85" />
            <rect x="18" y="13" width="5" height="1" fill="currentColor" opacity="0.85" />
            <rect x="19" y="15" width="4" height="1" fill="currentColor" opacity="0.85" />
            <rect x="20" y="17" width="3" height="1" fill="currentColor" opacity="0.85" />
            <rect x="23" y="12" width="1" height="4" fill="currentColor" />
          </>
        ) : (
          <>
            <rect x="20" y="10" width="3" height="1" fill="currentColor" />
            <rect x="20" y="12" width="3" height="1" fill="currentColor" />
            <rect x="20" y="14" width="3" height="1" fill="currentColor" />
            <rect x="21" y="16" width="2" height="1" fill="currentColor" />
          </>
        )}
      </g>

      {/* Nokia EMS-style hug motion lines on outer edges during squeeze */}
      {frame === 2 || frame === 3 ? (
        <>
          <rect x="6" y="7" width="2" height="1" fill="currentColor" opacity="0.65" />
          <rect x="5" y="8" width="1" height="2" fill="currentColor" opacity="0.65" />
          <rect x="32" y="7" width="2" height="1" fill="currentColor" opacity="0.65" />
          <rect x="34" y="8" width="1" height="2" fill="currentColor" opacity="0.65" />
        </>
      ) : null}
    </svg>
  );
};

