import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // In production, upload to Supabase Storage
    // For now, return a mock URL
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${nanoid()}.${ext}`
    const mockUrl = `https://picsum.photos/seed/${filename}/800/800`

    return NextResponse.json({ url: mockUrl, filename })
  } catch {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
