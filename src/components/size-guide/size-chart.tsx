import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SizeChartProps {
  data: Record<string, string>[]
  columns: string[]
  keys: string[]
}

export function SizeChart({ data, columns, keys }: SizeChartProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-asa-charcoal hover:bg-asa-charcoal">
            {columns.map((col) => (
              <TableHead key={col} className="text-white font-semibold">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keys.map((key) => (
                <TableCell key={key} className={key === 'size' ? 'font-semibold' : ''}>
                  {row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
