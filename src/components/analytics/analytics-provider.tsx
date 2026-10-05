import { FacebookPixel } from './facebook-pixel'
import { TikTokPixel } from './tiktok-pixel'
import { PostHogProvider } from './posthog-provider'

export function AnalyticsProvider() {
  return (
    <>
      <FacebookPixel />
      <TikTokPixel />
      <PostHogProvider />
    </>
  )
}
