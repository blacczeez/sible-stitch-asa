import { heightReference, inchesToCm, type MeasurementUnit } from '@/lib/size-guide'

interface HeightReferenceProps {
  unit: MeasurementUnit
}

function formatHeight(inches: number, unit: MeasurementUnit): string {
  if (unit === 'cm') {
    return `${inchesToCm(inches)} cm`
  }
  const feet = Math.floor(inches / 12)
  const remaining = inches % 12
  return `${feet}'${remaining}"`
}

export function HeightReference({ unit }: HeightReferenceProps) {
  return (
    <p className="text-sm text-muted-foreground mt-3 italic">
      {heightReference.label}{' '}
      <span className="font-medium text-asa-charcoal">
        {formatHeight(heightReference.minIn, unit)}
      </span>{' '}
      and{' '}
      <span className="font-medium text-asa-charcoal">
        {formatHeight(heightReference.maxIn, unit)}
      </span>
      . {heightReference.note}
    </p>
  )
}
