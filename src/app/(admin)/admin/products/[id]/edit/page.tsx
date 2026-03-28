'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockProducts } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const product = mockProducts.find((p) => p.id === id) || mockProducts[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Product updated (mock)')
    router.push('/admin/products')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={product.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" defaultValue={product.slug} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" defaultValue={product.description} rows={4} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" defaultValue={product.price} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare Price</Label>
                <Input id="comparePrice" type="number" step="0.01" defaultValue={product.comparePrice || ''} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className="text-sm w-16">{variant.size}</span>
                  <span className="text-sm w-20">{variant.color}</span>
                  <span className="text-sm w-24 font-mono">{variant.sku}</span>
                  <Input
                    type="number"
                    defaultValue={variant.stock}
                    className="w-20 text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-asa-charcoal">
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
