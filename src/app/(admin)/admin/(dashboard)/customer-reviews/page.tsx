'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MediaUploader } from '@/components/admin/media-uploader'
import {
  adminGlassDataPanel,
  adminPageTitleClass,
  adminPrimaryButtonClass,
} from '@/lib/admin-ui'
import { cn, formatDate } from '@/lib/utils'
import { extractApiErrorMessage } from '@/lib/api-errors'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RatingStars } from '@/components/ui/rating-stars'
import type { CustomerStory, CustomerStoryMediaType, ReviewSubmission } from '@/types'

type ProductOption = { id: string; name: string; slug: string }

type StoryFormState = {
  customerName: string
  description: string
  mediaUrl: string
  mediaType: CustomerStoryMediaType
  productId: string
  status: 'draft' | 'published'
  sortOrder: string
  sourceReviewId: string | null
}

const defaultForm: StoryFormState = {
  customerName: '',
  description: '',
  mediaUrl: '',
  mediaType: 'image',
  productId: '',
  status: 'draft',
  sortOrder: '0',
  sourceReviewId: null,
}

function isStoryFormValid(form: StoryFormState): boolean {
  const sortOrder = Number.parseInt(form.sortOrder, 10)
  return (
    form.customerName.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.mediaUrl.trim().length > 0 &&
    form.productId.length > 0 &&
    Number.isInteger(sortOrder) &&
    sortOrder >= 0
  )
}

export default function AdminCustomerReviewsPage() {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([])
  const [stories, setStories] = useState<CustomerStory[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null)
  const [form, setForm] = useState<StoryFormState>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [storyToDelete, setStoryToDelete] = useState<CustomerStory | null>(null)

  const editingStory = useMemo(
    () => stories.find((s) => s.id === editingStoryId) ?? null,
    [stories, editingStoryId]
  )

  async function loadAll() {
    setLoading(true)
    try {
      const [subRes, storiesRes, productsRes] = await Promise.all([
        fetch('/api/admin/review-submissions', { credentials: 'include' }),
        fetch('/api/admin/customer-stories', { credentials: 'include' }),
        fetch('/api/admin/products?status=published&limit=500', {
          credentials: 'include',
        }),
      ])

      const [subData, storiesData, productsData] = await Promise.all([
        subRes.json(),
        storiesRes.json(),
        productsRes.json(),
      ])

      if (subRes.ok) setSubmissions(subData.submissions ?? [])
      if (storiesRes.ok) setStories(storiesData.stories ?? [])
      if (productsRes.ok) {
        setProducts(
          (productsData.products ?? []).map((p: { id: string; name: string; slug: string }) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
          }))
        )
      }
    } catch {
      toast.error('Could not load customer reviews data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
  }, [])

  function openCreateDialog(prefill?: Partial<StoryFormState>) {
    setEditingStoryId(null)
    setForm({ ...defaultForm, ...prefill })
    setDialogOpen(true)
  }

  function openEditDialog(story: CustomerStory) {
    setEditingStoryId(story.id)
    setForm({
      customerName: story.customerName,
      description: story.description,
      mediaUrl: story.mediaUrl,
      mediaType: story.mediaType,
      productId: story.productId,
      status: story.status,
      sortOrder: String(story.sortOrder),
      sourceReviewId: story.sourceReviewId,
    })
    setDialogOpen(true)
  }

  function openFromSubmission(submission: ReviewSubmission) {
    if (submission.storyId) {
      const story = stories.find((s) => s.id === submission.storyId)
      if (story) {
        openEditDialog(story)
        return
      }
    }

    openCreateDialog({
      customerName: submission.customerName ?? '',
      description: submission.body ?? '',
      productId: submission.productId,
      sourceReviewId: submission.id,
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!isStoryFormValid(form)) {
      toast.error('Please complete all required fields')
      return
    }

    setSaving(true)
    const payload = {
      customerName: form.customerName.trim(),
      description: form.description.trim(),
      mediaUrl: form.mediaUrl.trim(),
      mediaType: form.mediaType,
      productId: form.productId,
      status: form.status,
      sortOrder: Number.parseInt(form.sortOrder, 10),
      sourceReviewId: form.sourceReviewId,
    }

    try {
      const res = await fetch(
        editingStoryId
          ? `/api/admin/customer-stories/${editingStoryId}`
          : '/api/admin/customer-stories',
        {
          method: editingStoryId ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(extractApiErrorMessage(data, 'Could not save story'))
      }

      toast.success(editingStoryId ? 'Story updated' : 'Story created')
      setDialogOpen(false)
      setForm(defaultForm)
      setEditingStoryId(null)
      await loadAll()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save story')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!storyToDelete) return
    const target = storyToDelete
    setDeletingId(target.id)
    try {
      const res = await fetch(`/api/admin/customer-stories/${target.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(extractApiErrorMessage(data, 'Could not delete story'))
      }
      toast.success('Story deleted')
      setStoryToDelete(null)
      await loadAll()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete story')
    } finally {
      setDeletingId(null)
    }
  }

  async function togglePublish(story: CustomerStory) {
    const nextStatus = story.status === 'published' ? 'draft' : 'published'
    setPublishingId(story.id)
    try {
      const res = await fetch(`/api/admin/customer-stories/${story.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: story.customerName,
          description: story.description,
          mediaUrl: story.mediaUrl,
          mediaType: story.mediaType,
          productId: story.productId,
          status: nextStatus,
          sortOrder: story.sortOrder,
          sourceReviewId: story.sourceReviewId,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(extractApiErrorMessage(data, 'Could not update status'))
      }
      toast.success(nextStatus === 'published' ? 'Story published' : 'Story unpublished')
      await loadAll()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update status')
    } finally {
      setPublishingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={adminPageTitleClass}>Customer Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Turn customer submissions into published stories for the storefront.
          </p>
        </div>
        <Button
          className={cn(adminPrimaryButtonClass)}
          onClick={() => openCreateDialog()}
        >
          <Plus className="size-4" />
          New Story
        </Button>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">
            Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="showcase">
            Showcase ({stories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-4">
          <div className={adminGlassDataPanel}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No customer submissions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {submission.customerName || 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(submission.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{submission.productName}</TableCell>
                      <TableCell>
                        <RatingStars rating={submission.rating} size={14} />
                      </TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground line-clamp-2">
                        {submission.body}
                      </TableCell>
                      <TableCell>
                        {submission.hasStory ? (
                          <Badge
                            variant="secondary"
                            className={
                              submission.storyStatus === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {submission.storyStatus === 'published' ? 'Published' : 'Draft'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not published</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openFromSubmission(submission)}
                        >
                          {submission.hasStory ? (
                            <>
                              <Pencil className="size-3.5" />
                              Edit story
                            </>
                          ) : (
                            <>
                              <Star className="size-3.5" />
                              Create story
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="showcase" className="mt-4">
          <div className={adminGlassDataPanel}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No showcase stories yet. Create one from a submission or add manually.
                    </TableCell>
                  </TableRow>
                ) : (
                  stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>
                        <div className="relative size-14 overflow-hidden rounded-lg bg-asa-cream">
                          {story.mediaType === 'video' ? (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              Video
                            </div>
                          ) : (
                            <Image
                              src={story.mediaUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{story.customerName}</TableCell>
                      <TableCell className="text-sm">{story.productName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            story.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {story.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{story.sortOrder}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void togglePublish(story)}
                            disabled={
                              publishingId === story.id || deletingId === story.id
                            }
                          >
                            {publishingId === story.id ? (
                              <span className="inline-flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                Saving...
                              </span>
                            ) : story.status === 'published' ? (
                              'Unpublish'
                            ) : (
                              'Publish'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(story)}
                            disabled={
                              publishingId === story.id || deletingId === story.id
                            }
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStoryToDelete(story)}
                            disabled={
                              publishingId === story.id || deletingId === story.id
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingStoryId(null)
            setForm(defaultForm)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStory ? 'Edit customer story' : 'Create customer story'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaUploader
              mediaUrl={form.mediaUrl}
              mediaType={form.mediaType}
              onChange={(mediaUrl, mediaType) =>
                setForm((prev) => ({ ...prev, mediaUrl, mediaType }))
              }
            />

            <div className="space-y-4">
              <div>
                <Label htmlFor="story-name">Customer name</Label>
                <Input
                  id="story-name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="story-product">Linked product</Label>
                <Select
                  value={form.productId}
                  onValueChange={(productId) =>
                    setForm((prev) => ({ ...prev, productId }))
                  }
                >
                  <SelectTrigger id="story-product" className="mt-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="story-description">Description</Label>
                <Textarea
                  id="story-description"
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Inspiring story about the fabrics, fit, and feeling..."
                  className="mt-1 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="story-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(status: 'draft' | 'published') =>
                      setForm((prev) => ({ ...prev, status }))
                    }
                  >
                    <SelectTrigger id="story-status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="story-sort">Sort order</Label>
                  <Input
                    id="story-sort"
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={adminPrimaryButtonClass}
                  disabled={saving || !isStoryFormValid(form)}
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Saving...
                    </span>
                  ) : editingStoryId ? (
                    'Save changes'
                  ) : (
                    'Create story'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={storyToDelete !== null}
        onOpenChange={(open) => {
          if (!open && deletingId) return
          if (!open) setStoryToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer story?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {storyToDelete ? (
                  <p>
                    &quot;{storyToDelete.customerName}&quot; will be permanently
                    removed from the showcase. This cannot be undone.
                  </p>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => void confirmDelete()}
            >
              {deletingId ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
