import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  change?: number
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, change, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <p
                className={cn(
                  'text-xs mt-1',
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change >= 0 ? '+' : ''}
                {change}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-asa-gold/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-asa-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
