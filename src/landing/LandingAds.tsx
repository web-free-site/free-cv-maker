import { AdSlot, SponsoredSmartlink, useAdScripts } from '@/components/ads/AdSlot'

export function LandingAdsTop() {
  useAdScripts()
  return (
    <div className="landing-ad-row">
      <AdSlot slot="homeTop728x90" />
    </div>
  )
}

export function LandingAdsMid() {
  return (
    <div className="landing-ad-row landing-ad-mid">
      <AdSlot slot="content468x60" />
      <AdSlot slot="content300x250" />
      <AdSlot slot="nativeBelowResult" />
    </div>
  )
}

export function LandingSmartlink() {
  return <SponsoredSmartlink className="landing-smartlink" />
}