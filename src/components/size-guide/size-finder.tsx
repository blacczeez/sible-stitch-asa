'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  sizeGuideTabsListClass,
  sizeGuideTabTriggerClass,
} from '@/components/size-guide/size-guide-tab-styles'
import { sizeConversionMap, type SizeRegion } from '@/lib/size-guide'

export function SizeFinder() {
  const [region, setRegion] = useState<SizeRegion>('us')
  const [selectedSize, setSelectedSize] = useState<string>('')

  const entries = sizeConversionMap[region]
  const result = entries.find((e) => e.label === selectedSize)

  return (
    <Card className="border-asa-gold/30">
      <CardContent className="py-5 px-5">
        <h3 className="text-lg font-serif font-bold text-asa-charcoal mb-4">
          Find Your Size
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">1. Select your region</p>
            <Tabs
              value={region}
              onValueChange={(value) => {
                setRegion(value as SizeRegion)
                setSelectedSize('')
              }}
            >
              <TabsList className={sizeGuideTabsListClass}>
                {(['us', 'uk', 'eu'] as const).map((r) => (
                  <TabsTrigger
                    key={r}
                    value={r}
                    className={sizeGuideTabTriggerClass}
                  >
                    {r.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">2. Select your size</p>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full max-w-[200px]">
                <SelectValue placeholder="Choose a size" />
              </SelectTrigger>
              <SelectContent>
                {entries.map((entry) => (
                  <SelectItem key={entry.label} value={entry.label}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {result && (
            <div>
              <p className="text-sm font-medium mb-2">3. Your recommended size</p>
              <Badge className="bg-asa-gold text-asa-charcoal text-lg px-4 py-1.5 font-bold hover:bg-asa-gold/90">
                {result.asaSize}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
