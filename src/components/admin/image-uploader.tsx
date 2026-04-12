'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, GripVertical, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUploader({
  value,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<number>(0)
  const [dragOver, setDragOver] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxImages - value.length
      const toUpload = files.slice(0, remaining)
      if (toUpload.length === 0) {
        toast.error(`Maximum of ${maxImages} images allowed`)
        return
      }

      setUploading((prev) => prev + toUpload.length)

      const results = await Promise.allSettled(
        toUpload.map(async (file) => {
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
          return data.url as string
        })
      )

      const urls: string[] = []
      for (const result of results) {
        if (result.status === 'fulfilled') {
          urls.push(result.value)
        } else {
          toast.error(result.reason?.message || 'Upload failed')
        }
      }

      if (urls.length > 0) {
        onChange([...value, ...urls])
      }

      setUploading((prev) => prev - toUpload.length)
    },
    [value, onChange, maxImages]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (files.length > 0) uploadFiles(files)
    },
    [uploadFiles]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) uploadFiles(files)
      e.target.value = ''
    },
    [uploadFiles]
  )

  const removeImage = useCallback(
    (idx: number) => {
      onChange(value.filter((_, i) => i !== idx))
    },
    [value, onChange]
  )

  // Drag reorder handlers
  const handleThumbDragStart = useCallback(
    (e: React.DragEvent, idx: number) => {
      setDragIdx(idx)
      e.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  const handleThumbDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDragOverIdx(idx)
    },
    []
  )

  const handleThumbDrop = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault()
      e.stopPropagation()
      if (dragIdx === null || dragIdx === idx) {
        setDragIdx(null)
        setDragOverIdx(null)
        return
      }
      const reordered = [...value]
      const [moved] = reordered.splice(dragIdx, 1)
      reordered.splice(idx, 0, moved)
      onChange(reordered)
      setDragIdx(null)
      setDragOverIdx(null)
    },
    [dragIdx, value, onChange]
  )

  const handleThumbDragEnd = useCallback(() => {
    setDragIdx(null)
    setDragOverIdx(null)
  }, [])

  const atMax = value.length >= maxImages

  return (
    <div className="space-y-3">
      {/* Thumbnail grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              draggable
              onDragStart={(e) => handleThumbDragStart(e, idx)}
              onDragOver={(e) => handleThumbDragOver(e, idx)}
              onDrop={(e) => handleThumbDrop(e, idx)}
              onDragEnd={handleThumbDragEnd}
              className={cn(
                'group relative aspect-square rounded-lg overflow-hidden ring-1 ring-black/10 cursor-grab active:cursor-grabbing transition-all',
                dragIdx === idx && 'opacity-40',
                dragOverIdx === idx && dragIdx !== idx && 'ring-2 ring-[#D4AD5A]'
              )}
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              {/* Main badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#D4AD5A] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
              {/* Drag handle + remove overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <GripVertical className="text-white opacity-0 group-hover:opacity-70 w-5 h-5 absolute top-1.5 right-8 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Upload skeletons */}
          {Array.from({ length: uploading }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center ring-1 ring-black/5"
            >
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {!atMax && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            dragOver
              ? 'border-[#D4AD5A] bg-[#D4AD5A]/5'
              : 'border-muted-foreground/25 hover:border-[#D4AD5A]/60 hover:bg-muted/30'
          )}
        >
          {uploading > 0 ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              {value.length === 0 ? (
                <ImageIcon className="w-10 h-10 stroke-[1.2]" />
              ) : (
                <Upload className="w-8 h-8 stroke-[1.5]" />
              )}
              <p className="text-sm font-medium">
                {value.length === 0
                  ? 'Drop images here or click to upload'
                  : 'Add more images'}
              </p>
              <p className="text-xs">
                JPEG, PNG, WebP, or AVIF up to 5 MB
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Image count */}
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxImages} images{value.length > 0 && ' — drag to reorder'}
      </p>
    </div>
  )
}
