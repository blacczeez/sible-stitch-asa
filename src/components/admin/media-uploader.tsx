'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { CustomerStoryMediaType } from '@/types'

interface MediaUploaderProps {
  mediaUrl: string
  mediaType: CustomerStoryMediaType
  onChange: (mediaUrl: string, mediaType: CustomerStoryMediaType) => void
}

export function MediaUploader({ mediaUrl, mediaType, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const data = await res.json()
      onChange(data.url as string, (data.mediaType as CustomerStoryMediaType) ?? 'image')
      toast.success('Media uploaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void uploadFile(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      {mediaUrl ? (
        <div className="relative overflow-hidden rounded-xl bg-asa-cream aspect-[4/5] max-h-72">
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              className="h-full w-full object-contain"
              controls
              playsInline
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="Story media preview"
              fill
              className="object-contain"
              sizes="320px"
            />
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 size-8 rounded-full bg-white/90"
            onClick={() => onChange('', 'image')}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-10 text-sm text-muted-foreground transition-colors hover:border-asa-gold/50 hover:bg-muted/50',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin text-asa-gold" />
          ) : (
            <>
              <Upload className="size-8 text-asa-gold/80" />
              <span>Upload image or video</span>
              <span className="text-xs">JPEG, PNG, WebP, MP4, WebM up to 50MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      {mediaUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Film className="size-4" />
          Replace media
        </Button>
      )}
    </div>
  )
}
