/**
 * Single source of truth for the /size-guide charts and storefront size labels.
 * All measurements stored as numbers in inches — cm computed at render.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MeasurementUnit = 'in' | 'cm'

export interface SizeRow {
  size: string
  us: string
  uk: string
  eu: string
  [key: string]: string | number
}

export interface TopsSizeRow extends SizeRow {
  bust: number
  waist: number
  shoulders: number
  length: number
}

export interface BottomsSizeRow extends SizeRow {
  waist: number
  hips: number
  length: number
}

export interface DressesSizeRow extends SizeRow {
  bust: number
  waist: number
  hips: number
  length: number
}

export interface AccessorySizeRow {
  item: string
  dimensions: { in: string; cm: string }
  notes: string
}

export interface FitNote {
  category: string
  points: string[]
}

export interface BrandComparison {
  asaSize: string
  zara: string
  hm: string
  asos: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10
}

export function formatMeasurement(value: number, unit: MeasurementUnit): string {
  if (unit === 'cm') {
    return `${inchesToCm(value)} cm`
  }
  return `${value}"`
}

// ---------------------------------------------------------------------------
// Size Charts — XS through 2XL
// ---------------------------------------------------------------------------

export const sizeGuideCharts = {
  tops: [
    { size: 'XS', us: '0–2', uk: '4–6', eu: '32–34', bust: 32, waist: 24, shoulders: 13.5, length: 24 },
    { size: 'S', us: '4–6', uk: '8–10', eu: '36–38', bust: 34, waist: 26, shoulders: 14, length: 25 },
    { size: 'M', us: '8–10', uk: '12–14', eu: '40–42', bust: 36, waist: 28, shoulders: 15, length: 26 },
    { size: 'L', us: '12–14', uk: '16–18', eu: '44–46', bust: 38, waist: 30, shoulders: 16, length: 27 },
    { size: 'XL', us: '16–18', uk: '20–22', eu: '48–50', bust: 40, waist: 32, shoulders: 17, length: 28 },
    { size: '2XL', us: '20–22', uk: '24–26', eu: '52–54', bust: 42, waist: 34, shoulders: 18, length: 29 },
  ] as TopsSizeRow[],

  bottoms: [
    { size: 'XS', us: '0–2', uk: '4–6', eu: '32–34', waist: 24, hips: 34, length: 39 },
    { size: 'S', us: '4–6', uk: '8–10', eu: '36–38', waist: 26, hips: 36, length: 40 },
    { size: 'M', us: '8–10', uk: '12–14', eu: '40–42', waist: 28, hips: 38, length: 41 },
    { size: 'L', us: '12–14', uk: '16–18', eu: '44–46', waist: 30, hips: 40, length: 42 },
    { size: 'XL', us: '16–18', uk: '20–22', eu: '48–50', waist: 32, hips: 42, length: 43 },
    { size: '2XL', us: '20–22', uk: '24–26', eu: '52–54', waist: 34, hips: 44, length: 44 },
  ] as BottomsSizeRow[],

  dresses: [
    { size: 'XS', us: '0–2', uk: '4–6', eu: '32–34', bust: 32, waist: 24, hips: 34, length: 41 },
    { size: 'S', us: '4–6', uk: '8–10', eu: '36–38', bust: 34, waist: 26, hips: 36, length: 42 },
    { size: 'M', us: '8–10', uk: '12–14', eu: '40–42', bust: 36, waist: 28, hips: 38, length: 43 },
    { size: 'L', us: '12–14', uk: '16–18', eu: '44–46', bust: 38, waist: 30, hips: 40, length: 44 },
    { size: 'XL', us: '16–18', uk: '20–22', eu: '48–50', bust: 40, waist: 32, hips: 42, length: 45 },
    { size: '2XL', us: '20–22', uk: '24–26', eu: '52–54', bust: 42, waist: 34, hips: 44, length: 46 },
  ] as DressesSizeRow[],
} as const

// ---------------------------------------------------------------------------
// Accessories
// ---------------------------------------------------------------------------

export const accessorySizes: AccessorySizeRow[] = [
  {
    item: 'Headwrap (Standard)',
    dimensions: { in: '72" × 22"', cm: '183 × 56 cm' },
    notes: 'Fits most head sizes; versatile tying styles',
  },
  {
    item: 'Headwrap (Petite)',
    dimensions: { in: '54" × 18"', cm: '137 × 46 cm' },
    notes: 'Shorter length for simpler wraps',
  },
  {
    item: 'Tote Bag',
    dimensions: { in: '15" × 13" × 5"', cm: '38 × 33 × 13 cm' },
    notes: 'Fits a 13" laptop',
  },
  {
    item: 'Crossbody Bag',
    dimensions: { in: '9" × 7" × 3"', cm: '23 × 18 × 8 cm' },
    notes: 'Adjustable strap 22"–48"',
  },
  {
    item: 'Clutch',
    dimensions: { in: '11" × 6"', cm: '28 × 15 cm' },
    notes: 'Removable wrist strap included',
  },
]

// ---------------------------------------------------------------------------
// Fit Notes
// ---------------------------------------------------------------------------

export const fitNotes: FitNote[] = [
  {
    category: 'tops',
    points: [
      'Ankara cotton has minimal stretch — if between sizes, size up for comfort.',
      'Our prints are pre-washed to minimize shrinkage after purchase.',
      'Relaxed fit through the body with a slightly cropped silhouette on most styles.',
    ],
  },
  {
    category: 'bottoms',
    points: [
      'High-waisted fit sits at or above the natural waistline.',
      'Ankara wax-print fabric is structured with little give — size up if you prefer a looser fit.',
      'Wide-leg and palazzo styles run true to size; pencil silhouettes may feel snug through the hips.',
    ],
  },
  {
    category: 'dresses',
    points: [
      'Dress lengths are measured from the highest shoulder point to hem.',
      'Fit-and-flare styles are more forgiving through the hips than bodycon cuts.',
      'For midi and maxi lengths, see the height reference below to estimate where the hem will fall on you.',
    ],
  },
]

// ---------------------------------------------------------------------------
// Height Reference (Dresses)
// ---------------------------------------------------------------------------

export const heightReference = {
  label: 'Our dress lengths are designed for heights between',
  minIn: 63, // 5'3"
  maxIn: 69, // 5'9"
  note: 'If you are shorter or taller, hemlines will fall differently. Consider a hem adjustment for the perfect length.',
}

// ---------------------------------------------------------------------------
// Brand Comparisons
// ---------------------------------------------------------------------------

export const brandComparisons: BrandComparison[] = [
  { asaSize: 'XS', zara: 'XS', hm: 'XS', asos: '2' },
  { asaSize: 'S', zara: 'S', hm: 'S', asos: '4–6' },
  { asaSize: 'M', zara: 'M', hm: 'M', asos: '8–10' },
  { asaSize: 'L', zara: 'L', hm: 'L', asos: '12–14' },
  { asaSize: 'XL', zara: 'XL', hm: 'XL', asos: '16–18' },
  { asaSize: '2XL', zara: 'XXL', hm: 'XXL', asos: '20–22' },
]

// ---------------------------------------------------------------------------
// Size Conversion Map — for "Find Your Size" reverse lookup
// ---------------------------------------------------------------------------

export type SizeRegion = 'us' | 'uk' | 'eu'

export interface SizeConversionEntry {
  label: string
  asaSize: string
}

export const sizeConversionMap: Record<SizeRegion, SizeConversionEntry[]> = {
  us: [
    { label: 'US 0–2', asaSize: 'XS' },
    { label: 'US 4–6', asaSize: 'S' },
    { label: 'US 8–10', asaSize: 'M' },
    { label: 'US 12–14', asaSize: 'L' },
    { label: 'US 16–18', asaSize: 'XL' },
    { label: 'US 20–22', asaSize: '2XL' },
  ],
  uk: [
    { label: 'UK 4–6', asaSize: 'XS' },
    { label: 'UK 8–10', asaSize: 'S' },
    { label: 'UK 12–14', asaSize: 'M' },
    { label: 'UK 16–18', asaSize: 'L' },
    { label: 'UK 20–22', asaSize: 'XL' },
    { label: 'UK 24–26', asaSize: '2XL' },
  ],
  eu: [
    { label: 'EU 32–34', asaSize: 'XS' },
    { label: 'EU 36–38', asaSize: 'S' },
    { label: 'EU 40–42', asaSize: 'M' },
    { label: 'EU 44–46', asaSize: 'L' },
    { label: 'EU 48–50', asaSize: 'XL' },
    { label: 'EU 52–54', asaSize: '2XL' },
  ],
}

// ---------------------------------------------------------------------------
// Ordered Sizes (for admin & storefront)
// ---------------------------------------------------------------------------

export const SIZE_GUIDE_ORDERED_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const

export type SizeGuideLabel = (typeof SIZE_GUIDE_ORDERED_SIZES)[number]
