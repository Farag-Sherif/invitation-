export default function SectionDivider({ type = 'line-flower' }) {
  if (type === 'ornamental') {
    return (
      <div className="section-divider-container" style={{ margin: '3rem auto', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
        <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10H100" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" />
          <path d="M120 10H210" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" />
          <rect x="106" y="6" width="8" height="8" rx="1" transform="rotate(45 106 6)" fill="var(--color-primary)" />
          <circle cx="110" cy="10" r="1.5" fill="var(--color-primary)" />
          <circle cx="95" cy="10" r="2.5" fill="var(--color-primary)" />
          <circle cx="125" cy="10" r="2.5" fill="var(--color-primary)" />
        </svg>
      </div>
    );
  }

  // Classic luxury floral vector divider
  return (
    <div className="section-divider-container" style={{ margin: '4rem auto', display: 'flex', justifyContent: 'center', opacity: 0.7 }}>
      <svg width="340" height="30" viewBox="0 0 340 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left line */}
        <path d="M10 15H140" stroke="url(#goldGradientLeft)" strokeWidth="1" strokeLinecap="round" />
        
        {/* Right line */}
        <path d="M200 15H330" stroke="url(#goldGradientRight)" strokeWidth="1" strokeLinecap="round" />

        {/* Center Floral Ornament */}
        <g transform="translate(157, 2)">
          {/* Petals */}
          <path d="M13 13C16 10 20 8 20 5C20 2 16 2 13 5C10 2 6 2 6 5C6 8 10 10 13 13Z" fill="var(--color-primary)" opacity="0.85" />
          <path d="M13 13C10 16 8 20 5 20C2 2 2 16 5 13C2 10 2 6 5 6C8 6 10 10 13 13Z" fill="var(--color-primary)" opacity="0.85" />
          <path d="M13 13C16 16 20 20 20 23C20 26 16 26 13 23C10 26 6 26 6 23C6 20 10 16 13 13Z" fill="var(--color-primary)" opacity="0.85" />
          <circle cx="13" cy="13" r="3" fill="var(--color-accent)" stroke="var(--color-primary)" strokeWidth="1" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGradientLeft" x1="10" y1="15" x2="140" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="goldGradientRight" x1="200" y1="15" x2="330" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
