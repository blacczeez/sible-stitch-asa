import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { accessorySizes, type MeasurementUnit } from '@/lib/size-guide'

interface AccessoryChartProps {
  unit: MeasurementUnit
}

export function AccessoryChart({ unit }: AccessoryChartProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <p className="text-xs text-muted-foreground px-3 py-1.5 md:hidden">
          Swipe to see all columns &rarr;
        </p>
        <Table>
          <TableHeader>
            <TableRow className="bg-asa-charcoal hover:bg-asa-charcoal">
              <TableHead className="text-white font-semibold">Item</TableHead>
              <TableHead className="text-white font-semibold">Dimensions</TableHead>
              <TableHead className="text-white font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessorySizes.map((row) => (
              <TableRow key={row.item}>
                <TableCell className="font-semibold whitespace-nowrap">{row.item}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {unit === 'cm' ? row.dimensions.cm : row.dimensions.in}
                </TableCell>
                <TableCell className="text-muted-foreground">{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
