import { getSeriContent, getSeriRevision } from '@/lib/seri-content'

export async function GET() {
  try {
    const revision = await getSeriRevision()
    const content = await getSeriContent(revision)
    return Response.json(content, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ error: 'Pembaruan konten belum dapat dimuat.' }, { status: 503 })
  }
}
