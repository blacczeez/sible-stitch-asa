'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  sizeGuideTabsListClass,
  sizeGuideTabTriggerClass,
} from '@/components/size-guide/size-guide-tab-styles'
import type { MeasurementUnit } from '@/lib/size-guide'

interface UnitToggleProps {
  unit: MeasurementUnit
  onChange: (unit: MeasurementUnit) => void
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <Tabs
      value={unit}
      onValueChange={(value) => onChange(value as MeasurementUnit)}
    >
      <TabsList className={sizeGuideTabsListClass}>
        <TabsTrigger value="in" className={sizeGuideTabTriggerClass}>
          Inches
        </TabsTrigger>
        <TabsTrigger value="cm" className={sizeGuideTabTriggerClass}>
          Centimeters
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
