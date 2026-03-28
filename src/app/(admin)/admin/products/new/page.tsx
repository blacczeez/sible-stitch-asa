'use client'

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
import { mockCategories } from '@/lib/mock-data'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      status: 'draft',
      isFeatured: false,
      images: ['https://picsum.photos/seed/new/800/1000'],
      variants: [{ size: 'M', color: 'Default', sku: '', stock: 0 }],
    },
  })

  const name = watch('name')

  const onSubmit = async (_data: CreateProduct) => {
    toast.success('Product created (mock)')
    router.push('/admin/products')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
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
              <Input
                id="slug"
                {...register('slug')}
                value={name ? slugify(name) : ''}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={4} className="mt-1" />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
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
              <Select onValueChange={(val) => setValue('categoryId', val)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select defaultValue="draft" onValueChange={(val) => setValue('status', val as 'draft' | 'published' | 'archived')}>
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
              <Checkbox id="featured" onCheckedChange={(c) => setValue('isFeatured', !!c)} />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-asa-charcoal">
            Create Product
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
