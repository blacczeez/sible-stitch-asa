import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-asa-gold mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-asa-charcoal mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="bg-asa-charcoal">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
