type ValidationDetails = {
  formErrors?: string[]
  fieldErrors?: Record<string, string[] | undefined>
}

type ErrorPayload = {
  error?: string
  details?: ValidationDetails
}

export function extractApiErrorMessage(
  payload: unknown,
  fallback: string
): string {
  const p = (payload as ErrorPayload) || {}

  const fieldError =
    p.details?.fieldErrors &&
    Object.values(p.details.fieldErrors).flat().find(Boolean)
  if (fieldError) return fieldError

  const formError = p.details?.formErrors?.find(Boolean)
  if (formError) return formError

  if (p.error) return p.error

  return fallback
}
