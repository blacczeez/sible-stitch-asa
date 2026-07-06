'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SizeGuideContent } from '@/components/size-guide/size-guide-content'

interface SizeGuideModalProps {
  trigger: React.ReactNode
}

export function SizeGuideModal({ trigger }: SizeGuideModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-asa-charcoal">
            Size Guide
          </DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive size charts.
          </DialogDescription>
        </DialogHeader>
        <SizeGuideContent compact />
      </DialogContent>
    </Dialog>
  )
}
