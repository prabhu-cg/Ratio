/**
 * Hidden SVG filter definitions used to simulate colour-vision deficiencies inside the
 * preview canvas only. Referenced by id via CSS `filter: url(#id)` — see VISION_FILTER_IDS.
 * Matrices are the standard Brettel/Viénot dichromacy approximations used across most
 * open-source colour-blindness simulators.
 */
export function VisionFilters() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="ratio-vision-protanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>
        <filter id="ratio-vision-deuteranopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.7,   0.3,   0,   0, 0
                    0,     0.3,   0.7, 0, 0
                    0,     0,     0,   1, 0"
          />
        </filter>
        <filter id="ratio-vision-tritanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.95,  0.05,  0,     0, 0
                    0,     0.433, 0.567, 0, 0
                    0,     0.475, 0.525, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
