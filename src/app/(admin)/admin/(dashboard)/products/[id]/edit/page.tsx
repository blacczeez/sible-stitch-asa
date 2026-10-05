'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Plus, Trash2 } from 'lucide-react'
import { SIZE_GUIDE_ORDERED_SIZES } from '@/lib/size-guide'

type VariantDraft = {
  size: string
  color: string
  sku: string
  stock: number
  price?: number
}

function newVariantRow(): VariantDraft {
  return {
    size: 'M',
    color: 'Default',
    sku: `SKU-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    stock: 0,
  }
}

function sizeOptionsFor(current: string): string[] {
  if (
    current &&
    !(SIZE_GUIDE_ORDERED_SIZES as readonly string[]).includes(current)
  ) {
    return [current, ...SIZE_GUIDE_ORDERED_SIZES]
  }
  return [...SIZE_GUIDE_ORDERED_SIZES]
}

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
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState<VariantDraft[]>([newVariantRow()])
  const [saving, setSaving] = useState(false)

  const numericPrice = Number.parseFloat(price)
  const numericComparePrice = comparePrice ? Number.parseFloat(comparePrice) : null

  const variantsValid =
    variants.length > 0 &&
    variants.every(
      (v) =>
        v.size.trim().length > 0 &&
        v.color.trim().length > 0 &&
        v.sku.trim().length > 0 &&
        Number.isInteger(v.stock) &&
        v.stock >= 0 &&
        (v.price === undefined || (Number.isFinite(v.price) && v.price > 0))
    )

  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    images.length > 0 &&
    variantsValid &&
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
          setIsFeatured(p.isFeatured)
          setImages(p.images ?? [])
          setVariants(
            p.variants.length > 0
              ? p.variants.map((v) => ({
                  size: v.size,
                  color: v.color,
                  sku: v.sku,
                  stock: v.stock,
                  ...(v.price != null ? { price: v.price } : {}),
                }))
              : [newVariantRow()]
          )
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

  function updateVariant(index: number, patch: Partial<VariantDraft>) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v))
    )
  }

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
        isFeatured,
        images,
        variants: variants.map((v) => ({
          size: v.size.trim(),
          color: v.color.trim(),
          sku: v.sku.trim(),
          stock: v.stock,
          ...(v.price != null ? { price: v.price } : {}),
        })),
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
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={isFeatured}
                onCheckedChange={(c) => setIsFeatured(!!c)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Variants</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setVariants((prev) => [...prev, newVariantRow()])}
            >
              <Plus className="size-4" />
              Add variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Sizes match the{' '}
              <a
                href="/size-guide"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                size guide
              </a>
              . Each row is one sellable variant; size and color pairs must be
              unique. Leave variant price empty to use the product price.
            </p>
            {variants.map((variant, index) => (
              <div
                key={`${variant.sku}-${index}`}
                className="rounded-lg border border-border/80 bg-background/40 p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Variant {index + 1}
                  </span>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        setVariants((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="size-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`variant-${index}-size`}>Size</Label>
                    <Select
                      value={variant.size}
                      onValueChange={(size) => updateVariant(index, { size })}
                    >
                      <SelectTrigger
                        id={`variant-${index}-size`}
                        className="mt-1 w-full"
                      >
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptionsFor(variant.size).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`variant-${index}-color`}>Color</Label>
                    <Input
                      id={`variant-${index}-color`}
                      className="mt-1"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, { color: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-${index}-sku`}>SKU</Label>
                    <Input
                      id={`variant-${index}-sku`}
                      className="mt-1 font-mono text-sm"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, { sku: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-${index}-stock`}>Stock</Label>
                    <Input
                      id={`variant-${index}-stock`}
                      type="number"
                      min={0}
                      step={1}
                      className="mt-1"
                      value={variant.stock}
                      onChange={(e) => {
                        const n = Number.parseInt(e.target.value, 10)
                        updateVariant(index, {
                          stock: Number.isFinite(n) ? n : 0,
                        })
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`variant-${index}-price`}>
                      Variant price override (optional)
                    </Label>
                    <Input
                      id={`variant-${index}-price`}
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Uses product price above"
                      className="mt-1"
                      value={variant.price ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          updateVariant(index, { price: undefined })
                          return
                        }
                        const n = Number.parseFloat(raw)
                        updateVariant(index, {
                          price: Number.isFinite(n) && n > 0 ? n : undefined,
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
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
