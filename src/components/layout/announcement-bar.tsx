'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-asa-charcoal text-white/80 text-center py-2 px-4 text-xs tracking-widest uppercase relative">
      <span>
        Free shipping on orders over $150 &mdash; Use code{' '}
        <span className="font-semibold text-asa-gold">WELCOME15</span> for 15% off
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
