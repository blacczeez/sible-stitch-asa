import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function isCloudinaryConfigured(): boolean {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  return !!(
    cloud_name &&
    api_key &&
    api_secret &&
    !api_key.includes('placeholder')
  )
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options?: { folder?: string; publicId?: string }
): Promise<{ url: string; publicId: string }> {
  const folder = options?.folder ?? 'sible-products'

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      }
    )
    stream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('res.cloudinary.com')) return null

    const uploadToken = '/upload/'
    const uploadIdx = parsed.pathname.indexOf(uploadToken)
    if (uploadIdx === -1) return null

    let rest = parsed.pathname.slice(uploadIdx + uploadToken.length)
    rest = rest.replace(/^v\d+\//, '')

    const segments = rest.split('/').filter(Boolean)
    if (segments.length === 0) return null

    const last = segments[segments.length - 1]
    const dotIndex = last.lastIndexOf('.')
    if (dotIndex > 0) {
      segments[segments.length - 1] = last.slice(0, dotIndex)
    }

    return segments.join('/')
  } catch {
    return null
  }
}
