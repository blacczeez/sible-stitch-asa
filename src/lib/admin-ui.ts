/**
 * Shared admin dashboard styling — aligned with storefront glass panels and brand CTAs.
 */

/** Table / list container */
export const adminGlassDataPanel =
  'rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(26,23,20,0.08)] ring-1 ring-white/80 overflow-hidden'

/** Card shell (use with `<Card className={cn(adminGlassCard, className)} />`) */
export const adminGlassCard =
  'rounded-2xl border-0 bg-white/75 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(26,23,20,0.08)] ring-1 ring-white/80'

/** Primary actions — high contrast, matches storefront checkout CTA */
export const adminPrimaryButtonClass =
  'bg-asa-gold font-semibold text-asa-charcoal shadow-sm hover:bg-asa-gold/90 hover:text-asa-charcoal focus-visible:ring-asa-gold/40'

export const adminPageTitleClass =
  'text-3xl font-serif font-bold text-asa-charcoal tracking-tight'
