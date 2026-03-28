import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SizeChart } from '@/components/size-guide/size-chart'
import { MeasurementGuide } from '@/components/size-guide/measurement-guide'

const sizeData = {
  tops: [
    { size: 'S', bust: '34"', waist: '26"', shoulders: '14"', length: '25"' },
    { size: 'M', bust: '36"', waist: '28"', shoulders: '15"', length: '26"' },
    { size: 'L', bust: '38"', waist: '30"', shoulders: '16"', length: '27"' },
    { size: 'XL', bust: '40"', waist: '32"', shoulders: '17"', length: '28"' },
  ],
  bottoms: [
    { size: 'S', waist: '26"', hips: '36"', length: '40"' },
    { size: 'M', waist: '28"', hips: '38"', length: '41"' },
    { size: 'L', waist: '30"', hips: '40"', length: '42"' },
    { size: 'XL', waist: '32"', hips: '42"', length: '43"' },
  ],
  dresses: [
    { size: 'S', bust: '34"', waist: '26"', hips: '36"', length: '42"' },
    { size: 'M', bust: '36"', waist: '28"', hips: '38"', length: '43"' },
    { size: 'L', bust: '38"', waist: '30"', hips: '40"', length: '44"' },
    { size: 'XL', bust: '40"', waist: '32"', hips: '42"', length: '45"' },
  ],
}

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
            data={sizeData.tops}
            columns={['Size', 'Bust', 'Waist', 'Shoulders', 'Length']}
            keys={['size', 'bust', 'waist', 'shoulders', 'length']}
          />
        </TabsContent>

        <TabsContent value="bottoms">
          <SizeChart
            data={sizeData.bottoms}
            columns={['Size', 'Waist', 'Hips', 'Length']}
            keys={['size', 'waist', 'hips', 'length']}
          />
        </TabsContent>

        <TabsContent value="dresses">
          <SizeChart
            data={sizeData.dresses}
            columns={['Size', 'Bust', 'Waist', 'Hips', 'Length']}
            keys={['size', 'bust', 'waist', 'hips', 'length']}
          />
        </TabsContent>
      </Tabs>

      <MeasurementGuide />
    </div>
  )
}
