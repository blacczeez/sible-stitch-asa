import { Truck, Shield, RotateCcw, Lock } from 'lucide-react'

const props = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders over $150 worldwide',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Handcrafted with authentic African fabrics',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    description: 'SSL encrypted payment processing',
  },
]

export function ValueProps() {
  return (
    <section className="bg-white border-y border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {props.map((prop) => (
            <div key={prop.title} className="text-center">
              <prop.icon className="w-8 h-8 mx-auto mb-3 text-asa-gold" />
              <h3 className="font-semibold text-sm mb-1">{prop.title}</h3>
              <p className="text-xs text-muted-foreground">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
