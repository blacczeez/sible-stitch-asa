/**
 * Resolves "username" or full email for Supabase signInWithPassword.
 * If the value contains @, it is used as the email. Otherwise:
 * `username@${NEXT_PUBLIC_ADMIN_EMAIL_DOMAIN}`.
 */
export function resolveAdminLoginEmail(input: string):
  | { email: string }
  | { error: string } {
  const t = input.trim()
  if (!t) {
    return { error: 'Enter a username or email address.' }
  }
  if (t.includes('@')) {
    return { email: t.toLowerCase() }
  }
  const domain = process.env.NEXT_PUBLIC_ADMIN_EMAIL_DOMAIN
  if (!domain) {
    return {
      error:
        'Use your full email to sign in, or set NEXT_PUBLIC_ADMIN_EMAIL_DOMAIN to allow short usernames.',
    }
  }
  return { email: `${t}@${domain}`.toLowerCase() }
}
