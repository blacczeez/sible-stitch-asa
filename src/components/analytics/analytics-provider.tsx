import { FacebookPixel } from './facebook-pixel'
import { TikTokPixel } from './tiktok-pixel'

export function AnalyticsProvider() {
  return (
    <>
      <FacebookPixel />
      <TikTokPixel />
    </>
  )
}
