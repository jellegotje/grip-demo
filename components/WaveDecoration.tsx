export default function WaveDecoration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Donkerblauwe gestippelde golf */}
      <path
        d="M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="2.5"
        strokeDasharray="8 6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Mintgroene gestippelde golf, verschoven */}
      <path
        d="M0,80 C180,40 330,110 480,70 C630,30 780,110 930,70 C1080,30 1160,90 1200,75"
        fill="none"
        stroke="#5BC4A0"
        strokeWidth="2.5"
        strokeDasharray="8 6"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Tweede donkerblauwe golf, lager */}
      <path
        d="M0,95 C120,65 270,115 420,90 C570,65 720,115 870,85 C1020,55 1130,100 1200,90"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}
