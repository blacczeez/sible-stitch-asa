'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createProductSchema, type CreateProduct } from '@/validations/product'
import type { Category } from '@/types'
import { adminGlassCard, adminPageTitleClass, adminPrimaryButtonClass } from '@/lib/admin-ui'
import { cn, slugify } from '@/lib/utils'
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

function newVariantRow(): CreateProduct['variants'][number] {
  return {
    size: 'M',
    color: 'Default',
    sku: `SKU-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    stock: 0,
  }
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (!cancelled && res.ok) {
          setCategories(data.categories ?? [])
        }
      } catch {
        if (!cancelled) setCategories([])
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'draft',
      isFeatured: false,
      images: [],
      variants: [newVariantRow()],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  const name = watch('name')

  useEffect(() => {
    if (name) setValue('slug', slugify(name))
  }, [name, setValue])

  const onSubmit = async (data: CreateProduct) => {
    const slug = (data.slug && data.slug.trim()) || slugify(data.name)
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug }),
      })
      const err = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(extractApiErrorMessage(err, 'Could not create product'))
        return
      }
      toast.success('Product created')
      router.push('/admin/products')
    } catch {
      toast.error('Could not create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className={cn(adminPageTitleClass, 'mb-6')}>New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} className="mt-1" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} className="mt-1" readOnly />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={4} className="mt-1" />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              value={watch('images') ?? []}
              onChange={(urls) => setValue('images', urls, { shouldValidate: true })}
            />
            {errors.images && (
              <p className="text-xs text-destructive mt-2">{errors.images.message}</p>
            )}
          </CardContent>
        </Card>

        <Card className={adminGlassCard}>
          <CardHeader>
            <CardTitle>Pricing & Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1" />
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare Price (optional)</Label>
                <Input id="comparePrice" type="number" step="0.01" {...register('comparePrice', { valueAsNumber: true })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(val) =>
                  setValue('categoryId', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-destructive mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <Select
                defaultValue="draft"
                onValueChange={(val) =>
                  setValue('status', val as 'draft' | 'published' | 'archived', {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
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
                onCheckedChange={(c) =>
                  setValue('isFeatured', !!c, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
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
              onClick={() => append(newVariantRow())}
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
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-border/80 bg-background/40 p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Variant {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`variant-${field.id}-size`}>Size</Label>
                    <Controller
                      control={control}
                      name={`variants.${index}.size`}
                      render={({ field: sizeField }) => (
                        <Select
                          value={sizeField.value}
                          onValueChange={sizeField.onChange}
                        >
                          <SelectTrigger
                            id={`variant-${field.id}-size`}
                            className="mt-1 w-full"
                          >
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {SIZE_GUIDE_ORDERED_SIZES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.variants?.[index]?.size && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.size?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`variant-${field.id}-color`}>Color</Label>
                    <Input
                      id={`variant-${field.id}-color`}
                      className="mt-1"
                      {...register(`variants.${index}.color`)}
                    />
                    {errors.variants?.[index]?.color && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.color?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`variant-${field.id}-sku`}>SKU</Label>
                    <Input
                      id={`variant-${field.id}-sku`}
                      className="mt-1 font-mono text-sm"
                      {...register(`variants.${index}.sku`)}
                    />
                    {errors.variants?.[index]?.sku && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.sku?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`variant-${field.id}-stock`}>Stock</Label>
                    <Input
                      id={`variant-${field.id}-stock`}
                      type="number"
                      min={0}
                      step={1}
                      className="mt-1"
                      {...register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.stock?.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`variant-${field.id}-price`}>
                      Variant price override (optional)
                    </Label>
                    <Input
                      id={`variant-${field.id}-price`}
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Uses product price above"
                      className="mt-1"
                      {...register(`variants.${index}.price`, {
                        setValueAs: (v) => {
                          if (v === '' || v == null) return undefined
                          const n =
                            typeof v === 'number' ? v : Number.parseFloat(String(v))
                          return Number.isFinite(n) && n > 0 ? n : undefined
                        },
                      })}
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.variants[index]?.price?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {typeof errors.variants?.message === 'string' && (
              <p className="text-xs text-destructive">{errors.variants.message}</p>
            )}
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
                    disabled={submitting || !isValid}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <LoadingSpinner size="sm" /> Creating...
                      </span>
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!submitting && !isValid && (
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
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
