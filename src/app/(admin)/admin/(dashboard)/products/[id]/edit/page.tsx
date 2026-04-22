'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/types'
import { adminGlassCard, adminPageTitleClass, adminPrimaryButtonClass } from '@/lib/admin-ui'
import { cn } from '@/lib/utils'
import { extractApiErrorMessage } from '@/lib/api-errors'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/admin/image-uploader'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const numericPrice = Number.parseFloat(price)
  const numericComparePrice = comparePrice ? Number.parseFloat(comparePrice) : null
  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    images.length > 0 &&
    (comparePrice.trim() === '' ||
      (Number.isFinite(numericComparePrice) && (numericComparePrice ?? 0) > 0))

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id) return
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (!cancelled && res.ok && data.product) {
          const p = data.product as Product
          setProduct(p)
          setName(p.name)
          setDescription(p.description)
          setPrice(String(p.price))
          setComparePrice(p.comparePrice != null ? String(p.comparePrice) : '')
          setStatus(p.status)
          setImages(p.images ?? [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      const payload = {
        name,
        description,
        price: numericPrice,
        ...(comparePrice.trim() !== '' ? { comparePrice: numericComparePrice } : {}),
        status,
        images,
      }
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(extractApiErrorMessage(data, 'Could not update product'))
        return
      }
      toast.success('Product updated')
      router.push('/admin/products')
    } catch {
      toast.error('Could not update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !product) {
    return (
      <div className="max-w-3xl">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className={cn(adminPageTitleClass, 'mb-6')}>Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={product.slug} className="mt-1" readOnly />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader value={images} onChange={setImages} />
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare Price</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Variants (read-only)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center gap-3 py-2 border-b last:border-0 text-sm"
                >
                  <span className="w-16">{variant.size}</span>
                  <span className="w-20">{variant.color}</span>
                  <span className="font-mono flex-1">{variant.sku}</span>
                  <span>Stock: {variant.stock}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    type="submit"
                    className={cn(adminPrimaryButtonClass)}
                    disabled={saving || !canSubmit}
                  >
                    {saving ? (
                      <span className="inline-flex items-center gap-2">
                        <LoadingSpinner size="sm" /> Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!saving && !canSubmit && (
                <TooltipContent side="top">
                  Complete all required fields with valid values.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
