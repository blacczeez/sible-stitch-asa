/**
 * Single source of truth for the /size-guide charts and storefront size labels.
 */
export const sizeGuideCharts = {
  tops: [
    { size: 'S', bust: '34"', waist: '26"', shoulders: '14"', length: '25"' },
    { size: 'M', bust: '36"', waist: '28"', shoulders: '15"', length: '26"' },
    { size: 'L', bust: '38"', waist: '30"', shoulders: '16"', length: '27"' },
    { size: 'XL', bust: '40"', waist: '32"', shoulders: '17"', length: '28"' },
  ],
  bottoms: [
    { size: 'S', waist: '26"', hips: '36"', length: '40"' },
    { size: 'M', waist: '28"', hips: '38"', length: '41"' },
    { size: 'L', waist: '30"', hips: '40"', length: '42"' },
    { size: 'XL', waist: '32"', hips: '42"', length: '43"' },
  ],
  dresses: [
    { size: 'S', bust: '34"', waist: '26"', hips: '36"', length: '42"' },
    { size: 'M', bust: '36"', waist: '28"', hips: '38"', length: '43"' },
    { size: 'L', bust: '38"', waist: '30"', hips: '40"', length: '44"' },
    { size: 'XL', bust: '40"', waist: '32"', hips: '42"', length: '45"' },
  ],
} as const

/** Same order as the size guide tables (S → XL). */
export const SIZE_GUIDE_ORDERED_SIZES = [
  ...sizeGuideCharts.tops.map((row) => row.size),
] as const

export type SizeGuideLabel = (typeof SIZE_GUIDE_ORDERED_SIZES)[number]
