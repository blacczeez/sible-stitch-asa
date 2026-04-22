'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
      variants: [
        { size: 'M', color: 'Default', sku: `NEW-${Date.now().toString(36)}`, stock: 10 },
      ],
    },
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
