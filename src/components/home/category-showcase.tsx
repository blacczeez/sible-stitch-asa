import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types'

interface CategoryShowcaseProps {
  categories: Category[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-asa-gold mb-2">
          Browse Collections
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-asa-charcoal">
          Shop by Category
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image
              src={category.image || 'https://picsum.photos/seed/cat/800/1000'}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-serif font-semibold text-white mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-white/70">{category.description}</p>
              <span className="inline-flex items-center gap-1 mt-4 px-5 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
