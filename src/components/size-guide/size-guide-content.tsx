'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SizeChart } from '@/components/size-guide/size-chart'
import { MeasurementGuide } from '@/components/size-guide/measurement-guide'
import { UnitToggle } from '@/components/size-guide/unit-toggle'
import { FitNoteBanner } from '@/components/size-guide/fit-note-banner'
import { HeightReference } from '@/components/size-guide/height-reference'
import { AccessoryChart } from '@/components/size-guide/accessory-chart'
import { SizeFinder } from '@/components/size-guide/size-finder'
import { BrandComparisonTable } from '@/components/size-guide/brand-comparison-table'
import {
  sizeGuideTabsListClass,
  sizeGuideTabTriggerClass,
} from '@/components/size-guide/size-guide-tab-styles'
import { sizeGuideCharts, type MeasurementUnit } from '@/lib/size-guide'

interface SizeGuideContentProps {
  compact?: boolean
}

const topsColumns = [
  { label: 'Size', key: 'size' },
  { label: 'US', key: 'us' },
  { label: 'UK', key: 'uk' },
  { label: 'EU', key: 'eu' },
  { label: 'Bust', key: 'bust', isMeasurement: true },
  { label: 'Waist', key: 'waist', isMeasurement: true },
  { label: 'Shoulders', key: 'shoulders', isMeasurement: true },
  { label: 'Length', key: 'length', isMeasurement: true },
]

const bottomsColumns = [
  { label: 'Size', key: 'size' },
  { label: 'US', key: 'us' },
  { label: 'UK', key: 'uk' },
  { label: 'EU', key: 'eu' },
  { label: 'Waist', key: 'waist', isMeasurement: true },
  { label: 'Hips', key: 'hips', isMeasurement: true },
  { label: 'Length', key: 'length', isMeasurement: true },
]

const dressesColumns = [
  { label: 'Size', key: 'size' },
  { label: 'US', key: 'us' },
  { label: 'UK', key: 'uk' },
  { label: 'EU', key: 'eu' },
  { label: 'Bust', key: 'bust', isMeasurement: true },
  { label: 'Waist', key: 'waist', isMeasurement: true },
  { label: 'Hips', key: 'hips', isMeasurement: true },
  { label: 'Length', key: 'length', isMeasurement: true },
]

export function SizeGuideContent({ compact }: SizeGuideContentProps) {
  const [unit, setUnit] = useState<MeasurementUnit>('in')

  return (
    <div className="space-y-8">
      {/* Unit toggle */}
      <div className="flex justify-end">
        <UnitToggle unit={unit} onChange={setUnit} />
      </div>

      {/* Size charts */}
      <Tabs defaultValue="tops">
        <TabsList className={`mb-6 ${sizeGuideTabsListClass}`}>
          <TabsTrigger value="tops" className={sizeGuideTabTriggerClass}>
            <span className="sm:hidden">Tops</span>
            <span className="hidden sm:inline">Tops & Shirts</span>
          </TabsTrigger>
          <TabsTrigger value="bottoms" className={sizeGuideTabTriggerClass}>
            Bottoms
          </TabsTrigger>
          <TabsTrigger value="dresses" className={sizeGuideTabTriggerClass}>
            Dresses
          </TabsTrigger>
          <TabsTrigger value="accessories" className={sizeGuideTabTriggerClass}>
            <span className="sm:hidden">Acc.</span>
            <span className="hidden sm:inline">Accessories</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tops">
          <FitNoteBanner category="tops" />
          <SizeChart
            data={[...sizeGuideCharts.tops]}
            columns={topsColumns}
            unit={unit}
          />
        </TabsContent>

        <TabsContent value="bottoms">
          <FitNoteBanner category="bottoms" />
          <SizeChart
            data={[...sizeGuideCharts.bottoms]}
            columns={bottomsColumns}
            unit={unit}
          />
        </TabsContent>

        <TabsContent value="dresses">
          <FitNoteBanner category="dresses" />
          <SizeChart
            data={[...sizeGuideCharts.dresses]}
            columns={dressesColumns}
            unit={unit}
          />
          <HeightReference unit={unit} />
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoryChart unit={unit} />
        </TabsContent>
      </Tabs>

      {/* Size Finder & Brand Comparison — hidden in modal */}
      {!compact && (
        <div className="space-y-8">
          <SizeFinder />
          <BrandComparisonTable />
        </div>
      )}

      {/* Measurement guide */}
      <MeasurementGuide unit={unit} />
    </div>
  )
}
