export default function WEYWLogo({ size = "text-6xl", className = "" }) {
  return (
    <div className={`font-bold ${size} ${className}`} style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      <span className="inline-block relative text-gray-900">
        WE
        <span className="relative inline-block text-gray-900">
          Y
          <span className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-blue-600 rounded-full"></span>
        </span>
        W
      </span>
    </div>
  )
}

