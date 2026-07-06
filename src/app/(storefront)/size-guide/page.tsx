import { SizeGuideContent } from '@/components/size-guide/size-guide-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide — International Sizing (US, UK, EU) | ASA',
  description:
    'Find your perfect ASA fit with our comprehensive size guide. Includes US, UK, and EU size equivalents, centimeter and inch measurements, brand comparisons, and an interactive size finder.',
}

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
        Size Guide
      </h1>
      <p className="text-muted-foreground mb-8">
        Find your perfect fit with our comprehensive size charts — available in US, UK, and EU sizes with inch and centimeter measurements.
      </p>

      <SizeGuideContent />
    </div>
  )
}
