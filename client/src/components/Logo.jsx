export function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="17" r="11.5" stroke="#5B8DFF" strokeWidth="2" opacity="0.4" />
      <rect x="9.5" y="8.5" width="13" height="9.5" rx="2.2" fill="#5B8DFF" />
      <circle cx="13.2" cy="13" r="2.1" fill="#0E141B" />
      <circle cx="18.5" cy="13" r="2.1" fill="#0E141B" />
      <rect x="12.3" y="19.5" width="7" height="7.3" rx="1.6" fill="#0E141B" />
    </svg>
  );
}
