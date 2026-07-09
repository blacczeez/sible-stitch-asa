import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { requireAdmin } from '@/lib/admin-auth'
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, MP4, WebM, MOV.',
        },
        { status: 400 }
      )
    }

    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isVideo
            ? 'Video too large. Maximum size is 50MB.'
            : 'File too large. Maximum size is 5MB.',
        },
        { status: 400 }
      )
    }

    if (isCloudinaryConfigured()) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const { url, publicId } = await uploadToCloudinary(buffer, {
        folder: isVideo ? 'tivaram-stories' : 'tivaram-products',
        resourceType: isVideo ? 'video' : 'image',
      })
      return NextResponse.json({
        url,
        publicId,
        filename: file.name,
        mediaType: isVideo ? 'video' : 'image',
      })
    }

    // Fallback: mock URL for local dev without Cloudinary credentials
    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
    const filename = `${nanoid()}.${ext}`
    const mockUrl = isVideo
      ? `https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`
      : `https://picsum.photos/seed/${filename}/800/800`

    return NextResponse.json({
      url: mockUrl,
      filename,
      mediaType: isVideo ? 'video' : 'image',
    })
  } catch {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
