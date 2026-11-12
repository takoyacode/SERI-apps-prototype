import 'server-only'

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const allowed = [
    new URL(request.url).origin,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.FIGMA_PUBLIC_URL,
  ].filter(Boolean)
  if (allowed.includes(origin)) return true
  return (
    request.headers.get('sec-fetch-site') === 'same-origin' &&
    new URL(origin).host ===
      (request.headers.get('x-forwarded-host') || request.headers.get('host'))
  )
}
export function secureRequest(request: Request) {
  return (
    request.headers.get('x-forwarded-proto') === 'https' ||
    request.headers.get('origin')?.startsWith('https://') === true
  )
}
export function errorResponse(message: string, status = 400, fields?: Record<string, string>) {
  return Response.json(
    { ok: false, error: message, fields },
    { status, headers: { 'Cache-Control': 'private, no-store' } },
  )
}
export async function readInput(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text()
  if (text.length > 15000) throw new Error('Data terlalu panjang.')
  const value = JSON.parse(text)
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Data tidak valid.')
  return value
}
