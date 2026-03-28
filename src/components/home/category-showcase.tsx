import Link from 'next/link'
import Image from 'next/image'
import { mockCategories } from '@/lib/mock-data'

export function CategoryShowcase() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
          Shop by Category
        </h2>
        <p className="text-muted-foreground">
          Explore our curated collections
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group relative aspect-[4/5] rounded-lg overflow-hidden"
          >
            <Image
              src={category.image || 'https://picsum.photos/seed/cat/800/1000'}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-white/80">{category.description}</p>
              <span className="inline-block mt-3 text-sm text-asa-gold font-medium group-hover:underline">
                Shop Now &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
