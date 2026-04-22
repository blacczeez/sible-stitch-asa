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
    <section className="">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {props.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-asa-gold/10 flex items-center justify-center mx-auto mb-4">
                <prop.icon className="w-6 h-6 text-asa-gold" />
              </div>
              <h3 className="font-serif font-semibold text-base mb-1">
                {prop.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
