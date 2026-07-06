export function MeasurementDiagram() {
  return (
    <div className="flex justify-center">
      <svg
        role="img"
        aria-label="Body measurement diagram showing where to measure bust, waist, hips, shoulders, and length"
        viewBox="0 0 200 360"
        className="w-full max-w-[200px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse cx="100" cy="30" rx="18" ry="22" stroke="#1A1714" strokeWidth="1.5" />

        {/* Neck */}
        <line x1="92" y1="52" x2="92" y2="65" stroke="#1A1714" strokeWidth="1.5" />
        <line x1="108" y1="52" x2="108" y2="65" stroke="#1A1714" strokeWidth="1.5" />

        {/* Shoulders */}
        <line x1="55" y1="70" x2="92" y2="65" stroke="#1A1714" strokeWidth="1.5" />
        <line x1="108" y1="65" x2="145" y2="70" stroke="#1A1714" strokeWidth="1.5" />

        {/* Arms */}
        <line x1="55" y1="70" x2="40" y2="170" stroke="#1A1714" strokeWidth="1.5" />
        <line x1="145" y1="70" x2="160" y2="170" stroke="#1A1714" strokeWidth="1.5" />

        {/* Torso left */}
        <path d="M55 70 Q50 110 60 130 Q55 160 65 195" stroke="#1A1714" strokeWidth="1.5" />
        {/* Torso right */}
        <path d="M145 70 Q150 110 140 130 Q145 160 135 195" stroke="#1A1714" strokeWidth="1.5" />

        {/* Legs */}
        <line x1="65" y1="195" x2="70" y2="330" stroke="#1A1714" strokeWidth="1.5" />
        <line x1="135" y1="195" x2="130" y2="330" stroke="#1A1714" strokeWidth="1.5" />
        {/* Inner legs */}
        <line x1="90" y1="195" x2="85" y2="330" stroke="#1A1714" strokeWidth="1.5" />
        <line x1="110" y1="195" x2="115" y2="330" stroke="#1A1714" strokeWidth="1.5" />

        {/* --- Measurement lines --- */}

        {/* Shoulders line */}
        <line x1="55" y1="70" x2="145" y2="70" stroke="#D4AD5A" strokeWidth="2" strokeDasharray="4 2" />
        <text x="170" y="74" fill="#1A1714" fontSize="10" fontWeight="600">Shoulders</text>

        {/* Bust line */}
        <line x1="52" y1="100" x2="148" y2="100" stroke="#D4AD5A" strokeWidth="2" strokeDasharray="4 2" />
        <text x="170" y="104" fill="#1A1714" fontSize="10" fontWeight="600">Bust</text>

        {/* Waist line */}
        <line x1="60" y1="130" x2="140" y2="130" stroke="#D4AD5A" strokeWidth="2" strokeDasharray="4 2" />
        <text x="170" y="134" fill="#1A1714" fontSize="10" fontWeight="600">Waist</text>

        {/* Hips line */}
        <line x1="62" y1="170" x2="138" y2="170" stroke="#D4AD5A" strokeWidth="2" strokeDasharray="4 2" />
        <text x="170" y="174" fill="#1A1714" fontSize="10" fontWeight="600">Hips</text>

        {/* Length line (vertical) */}
        <line x1="20" y1="70" x2="20" y2="330" stroke="#D4AD5A" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="15" y1="70" x2="25" y2="70" stroke="#D4AD5A" strokeWidth="1.5" />
        <line x1="15" y1="330" x2="25" y2="330" stroke="#D4AD5A" strokeWidth="1.5" />
        <text x="5" y="200" fill="#1A1714" fontSize="10" fontWeight="600" transform="rotate(-90 12 200)">Length</text>
      </svg>
    </div>
  )
}
