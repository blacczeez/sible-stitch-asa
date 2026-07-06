import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { brandComparisons } from '@/lib/size-guide'

export function BrandComparisonTable() {
  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-asa-charcoal mb-3">
        How We Compare to Other Brands
      </h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-asa-charcoal hover:bg-asa-charcoal">
                <TableHead className="text-white font-semibold">ASA Size</TableHead>
                <TableHead className="text-white font-semibold">Zara</TableHead>
                <TableHead className="text-white font-semibold">H&amp;M</TableHead>
                <TableHead className="text-white font-semibold">ASOS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandComparisons.map((row) => (
                <TableRow key={row.asaSize}>
                  <TableCell className="font-semibold">{row.asaSize}</TableCell>
                  <TableCell>{row.zara}</TableCell>
                  <TableCell>{row.hm}</TableCell>
                  <TableCell>{row.asos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 italic">
        Size equivalents are approximate. Each brand has its own fit and sizing standards.
      </p>
    </div>
  )
}
