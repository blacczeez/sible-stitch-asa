'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import { useUIStore } from '@/store/ui-store'
import { formatCurrency } from '@/lib/utils'

export function CartDrawer() {
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore()
  const { items, subtotal, removeItem, updateQuantity, hydrated } = useCart()

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-semibold">
            Shopping Bag ({hydrated ? items.length : 0})
          </SheetTitle>
        </SheetHeader>

        {!hydrated || items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4 font-serif italic">
                Your bag is empty
              </p>
              <Button
                onClick={() => setCartDrawerOpen(false)}
                className="bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 rounded-full px-8"
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-20 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-serif font-medium truncate hover:text-asa-gold transition-colors"
                        onClick={() => setCartDrawerOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-foreground p-1"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.size} / {item.color}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-secondary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-secondary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 px-4 pb-4 space-y-3">
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-serif font-semibold text-base">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Button
                className="w-full bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 rounded-full font-semibold"
                asChild
                onClick={() => setCartDrawerOpen(false)}
              >
                <Link href="/cart">View Bag & Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
