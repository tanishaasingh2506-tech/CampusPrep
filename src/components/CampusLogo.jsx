function CampusLogo({ size = 44 }) {
  return (
    <div
      className="campus-logo"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="campusGradient"
            x1="8"
            y1="8"
            x2="56"
            y2="56"
          >
            <stop offset="0%" stopColor="#38E8FF" />
            <stop offset="52%" stopColor="#5B9DFF" />
            <stop offset="100%" stopColor="#9B7CFF" />
          </linearGradient>
        </defs>

        {/* Shield */}
        <path
          d="M32 5L53 13V29C53 43 44 54 32 59C20 54 11 43 11 29V13L32 5Z"
          fill="url(#campusGradient)"
        />

        {/* Inner shield */}
        <path
          d="M32 10L48 16V29C48 40 41 49 32 54C23 49 16 40 16 29V16L32 10Z"
          fill="#071827"
          fillOpacity="0.75"
        />

        {/* Graduation cap */}
        <path
          d="M12 25L32 17L52 25L32 33L12 25Z"
          fill="white"
        />

        {/* Cap base */}
        <path
          d="M20 30V36C20 40 26 43 32 43C38 43 44 40 44 36V30L32 35L20 30Z"
          fill="white"
          fillOpacity="0.9"
        />

        {/* Tassel */}
        <path
          d="M52 25V34"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle
          cx="52"
          cy="35"
          r="2"
          fill="#38E8FF"
        />
      </svg>
    </div>
  );
}

export default CampusLogo;