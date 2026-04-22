'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ImageUploader } from '@/components/admin/image-uploader'
import {
  adminGlassDataPanel,
  adminPageTitleClass,
  adminPrimaryButtonClass,
} from '@/lib/admin-ui'
import { cn, slugify } from '@/lib/utils'
import { extractApiErrorMessage } from '@/lib/api-errors'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type CategoryRow = {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  sortOrder: number
  isActive: boolean
  productCount: number
}

type CategoryFormState = {
  name: string
  slug: string
  description: string
  image: string
  sortOrder: string
  isActive: boolean
}

const defaultFormState: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  image: '',
  sortOrder: '0',
  isActive: true,
}

const categorySlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isCategoryFormValid(form: CategoryFormState): boolean {
  const sortOrder = Number.parseInt(form.sortOrder, 10)
  const hasValidName = form.name.trim().length > 0 && form.name.trim().length <= 120
  const slug = form.slug.trim()
  const hasValidSlug =
    slug.length > 0 && slug.length <= 120 && categorySlugRegex.test(slug)
  const hasValidDescription = form.description.trim().length <= 500
  const hasValidSortOrder = Number.isInteger(sortOrder) && sortOrder >= 0
  return hasValidName && hasValidSlug && hasValidDescription && hasValidSortOrder
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState<CategoryFormState>(defaultFormState)
  const [editForm, setEditForm] = useState<CategoryFormState>(defaultFormState)
  const [creating, setCreating] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const editingCategory = useMemo(
    () => categories.find((category) => category.id === editingCategoryId) ?? null,
    [categories, editingCategoryId]
  )

  async function loadCategories() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setCategories(data.categories ?? [])
      } else {
        toast.error(data.error || 'Could not load categories')
      }
    } catch {
      setCategories([])
      toast.error('Could not load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  function toPayload(form: CategoryFormState) {
    return {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isActive: form.isActive,
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = toPayload(createForm)
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(extractApiErrorMessage(data, 'Could not create category'))
        return
      }
      toast.success('Category created')
      setCreateForm(defaultFormState)
      setCreateOpen(false)
      await loadCategories()
    } catch {
      toast.error('Could not create category')
    } finally {
      setCreating(false)
    }
  }

  function openEditDialog(category: CategoryRow) {
    setEditingCategoryId(category.id)
    setEditForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      image: category.image ?? '',
      sortOrder: String(category.sortOrder),
      isActive: category.isActive,
    })
    setEditOpen(true)
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingCategoryId) return
    setSavingEdit(true)
    try {
      const payload = toPayload(editForm)
      const res = await fetch(`/api/admin/categories/${editingCategoryId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(extractApiErrorMessage(data, 'Could not update category'))
        return
      }
      toast.success('Category updated')
      setEditOpen(false)
      setEditingCategoryId(null)
      await loadCategories()
    } catch {
      toast.error('Could not update category')
    } finally {
      setSavingEdit(false)
    }
  }

  async function toggleCategoryActive(category: CategoryRow) {
    setTogglingId(category.id)
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !category.isActive }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || 'Could not update category status')
        return
      }
      toast.success(
        category.isActive ? 'Category archived' : 'Category reactivated'
      )
      await loadCategories()
    } catch {
      toast.error('Could not update category status')
    } finally {
      setTogglingId(null)
    }
  }

  async function deleteCategory(category: CategoryRow) {
    const confirmed = window.confirm(
      `Delete "${category.name}" permanently? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(category.id)
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || 'Could not delete category')
        return
      }
      setCategories((prev) => prev.filter((item) => item.id !== category.id))
      toast.success('Category deleted')
    } catch {
      toast.error('Could not delete category')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={adminPageTitleClass}>Categories</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={adminPageTitleClass}>Categories</h1>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className={cn(adminPrimaryButtonClass)}>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="create-category-name">Name</Label>
                <Input
                  id="create-category-name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => {
                      const name = e.target.value
                      const shouldSyncSlug =
                        !prev.slug.trim() || prev.slug === slugify(prev.name)
                      return {
                        ...prev,
                        name,
                        slug: shouldSyncSlug ? slugify(name) : prev.slug,
                      }
                    })
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-category-slug">Slug</Label>
                <Input
                  id="create-category-slug"
                  value={createForm.slug}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      slug: slugify(e.target.value),
                    }))
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-category-description">Description</Label>
                <Textarea
                  id="create-category-description"
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Category Image</Label>
                <ImageUploader
                  value={createForm.image ? [createForm.image] : []}
                  maxImages={1}
                  onChange={(urls) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      image: urls[0] ?? '',
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="create-category-sortOrder">Sort Order</Label>
                <Input
                  id="create-category-sortOrder"
                  type="number"
                  min={0}
                  value={createForm.sortOrder}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      sortOrder: e.target.value,
                    }))
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="create-category-active"
                  checked={createForm.isActive}
                  onCheckedChange={(checked) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      isActive: checked === true,
                    }))
                  }
                />
                <Label htmlFor="create-category-active">Active category</Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex w-full">
                      <Button
                        type="submit"
                        className={cn('w-full', adminPrimaryButtonClass)}
                        disabled={creating || !isCategoryFormValid(createForm)}
                      >
                        {creating ? (
                          <span className="inline-flex items-center gap-2">
                            <LoadingSpinner size="sm" /> Creating...
                          </span>
                        ) : (
                          'Create Category'
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!creating && !isCategoryFormValid(createForm) && (
                    <TooltipContent side="top">
                      Complete all required fields with valid values.
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={adminGlassDataPanel}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-asa-charcoal">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{category.slug}</TableCell>
                <TableCell className="text-sm">{category.sortOrder}</TableCell>
                <TableCell className="text-sm">{category.productCount}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {category.isActive ? 'Active' : 'Archived'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(category)}
                      disabled={
                        togglingId === category.id || deletingId === category.id
                      }
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void toggleCategoryActive(category)}
                      disabled={
                        togglingId === category.id || deletingId === category.id
                      }
                    >
                      {togglingId === category.id ? (
                        <span className="inline-flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Saving...
                        </span>
                      ) : category.isActive ? (
                        'Archive'
                      ) : (
                        'Activate'
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void deleteCategory(category)}
                      disabled={
                        togglingId === category.id ||
                        deletingId === category.id ||
                        category.productCount > 0
                      }
                      title={
                        category.productCount > 0
                          ? 'Move products out of this category before deleting.'
                          : undefined
                      }
                    >
                      {deletingId === category.id ? (
                        <span className="inline-flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Deleting...
                        </span>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(nextOpen) => {
          setEditOpen(nextOpen)
          if (!nextOpen) {
            setEditingCategoryId(null)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Category{editingCategory ? ` — ${editingCategory.name}` : ''}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => {
                    const name = e.target.value
                    const shouldSyncSlug =
                      !prev.slug.trim() || prev.slug === slugify(prev.name)
                    return {
                      ...prev,
                      name,
                      slug: shouldSyncSlug ? slugify(name) : prev.slug,
                    }
                  })
                }
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category-slug">Slug</Label>
              <Input
                id="edit-category-slug"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category-description">Description</Label>
              <Textarea
                id="edit-category-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Category Image</Label>
              <ImageUploader
                value={editForm.image ? [editForm.image] : []}
                maxImages={1}
                onChange={(urls) =>
                  setEditForm((prev) => ({
                    ...prev,
                    image: urls[0] ?? '',
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-category-sortOrder">Sort Order</Label>
              <Input
                id="edit-category-sortOrder"
                type="number"
                min={0}
                value={editForm.sortOrder}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    sortOrder: e.target.value,
                  }))
                }
                className="mt-1"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-category-active"
                checked={editForm.isActive}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({
                    ...prev,
                    isActive: checked === true,
                  }))
                }
              />
              <Label htmlFor="edit-category-active">Active category</Label>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex w-full">
                    <Button
                      type="submit"
                      className={cn('w-full', adminPrimaryButtonClass)}
                      disabled={savingEdit || !isCategoryFormValid(editForm)}
                    >
                      {savingEdit ? (
                        <span className="inline-flex items-center gap-2">
                          <LoadingSpinner size="sm" /> Saving...
                        </span>
                      ) : (
                        'Save Category'
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!savingEdit && !isCategoryFormValid(editForm) && (
                  <TooltipContent side="top">
                    Complete all required fields with valid values.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
