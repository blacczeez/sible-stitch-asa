import { Card, CardContent } from '@/components/ui/card'
import { fitNotes } from '@/lib/size-guide'

interface FitNoteBannerProps {
  category: string
}

export function FitNoteBanner({ category }: FitNoteBannerProps) {
  const note = fitNotes.find((n) => n.category === category)
  if (!note) return null

  return (
    <Card className="mb-4 border-asa-gold/30 bg-asa-cream/50">
      <CardContent className="py-3 px-4">
        <p className="text-sm font-semibold text-asa-charcoal mb-1.5">Fit Notes</p>
        <ul className="space-y-1">
          {note.points.map((point, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-asa-gold mt-0.5 shrink-0">&#8226;</span>
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
