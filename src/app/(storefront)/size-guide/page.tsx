import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SizeChart } from '@/components/size-guide/size-chart'
import { MeasurementGuide } from '@/components/size-guide/measurement-guide'
import { sizeGuideCharts } from '@/lib/size-guide'

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
        Size Guide
      </h1>
      <p className="text-muted-foreground mb-8">
        Find your perfect fit with our comprehensive size charts.
      </p>

      <Tabs defaultValue="tops">
        <TabsList className="mb-6">
          <TabsTrigger value="tops">Tops & Shirts</TabsTrigger>
          <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          <TabsTrigger value="dresses">Dresses</TabsTrigger>
        </TabsList>

        <TabsContent value="tops">
          <SizeChart
            data={[...sizeGuideCharts.tops]}
            columns={['Size', 'Bust', 'Waist', 'Shoulders', 'Length']}
            keys={['size', 'bust', 'waist', 'shoulders', 'length']}
          />
        </TabsContent>

        <TabsContent value="bottoms">
          <SizeChart
            data={[...sizeGuideCharts.bottoms]}
            columns={['Size', 'Waist', 'Hips', 'Length']}
            keys={['size', 'waist', 'hips', 'length']}
          />
        </TabsContent>

        <TabsContent value="dresses">
          <SizeChart
            data={[...sizeGuideCharts.dresses]}
            columns={['Size', 'Bust', 'Waist', 'Hips', 'Length']}
            keys={['size', 'bust', 'waist', 'hips', 'length']}
          />
        </TabsContent>
      </Tabs>

      <MeasurementGuide />
    </div>
  )
}
