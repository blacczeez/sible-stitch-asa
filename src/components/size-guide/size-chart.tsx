import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatMeasurement, type MeasurementUnit } from '@/lib/size-guide'

interface SizeChartColumn {
  label: string
  key: string
  /** If true, the value is a number that should be formatted with the unit */
  isMeasurement?: boolean
}

interface SizeChartProps {
  data: Record<string, string | number>[]
  columns: SizeChartColumn[]
  unit: MeasurementUnit
}

export function SizeChart({ data, columns, unit }: SizeChartProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <p className="text-xs text-muted-foreground px-3 py-1.5 md:hidden">
          Swipe to see all sizes &rarr;
        </p>
        <Table>
          <TableHeader>
            <TableRow className="bg-asa-charcoal hover:bg-asa-charcoal">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-white font-semibold whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => {
                  const value = row[col.key]
                  const display =
                    col.isMeasurement && typeof value === 'number'
                      ? formatMeasurement(value, unit)
                      : String(value)
                  return (
                    <TableCell
                      key={col.key}
                      className={
                        col.key === 'size'
                          ? 'font-semibold whitespace-nowrap'
                          : 'whitespace-nowrap'
                      }
                    >
                      {display}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
