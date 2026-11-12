import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export const getSeriContent = unstable_cache(
  async (_revision?: string) => {
    const payload = await getPayloadClient()
    const [products, articles, creators, settings] = await Promise.all([
      payload.find({
        collection: 'products',
        overrideAccess: false,
        depth: 2,
        limit: 24,
        where: { _status: { equals: 'published' } },
        sort: 'createdAt',
      }),
      payload.find({
        collection: 'articles',
        overrideAccess: false,
        depth: 2,
        limit: 50,
        where: { _status: { equals: 'published' } },
        sort: 'createdAt',
      }),
      payload.find({
        collection: 'creators',
        overrideAccess: false,
        depth: 1,
        limit: 24,
        sort: 'createdAt',
      }),
      payload.findGlobal({ slug: 'seri-settings', overrideAccess: false, depth: 1 }),
    ])
    return { products: products.docs, articles: articles.docs, creators: creators.docs, settings }
  },
  ['seri-public-content-v1'],
  { tags: ['seri-content'] },
)
export type SeriContent = Awaited<ReturnType<typeof getSeriContent>>

// Admin hooks invalidate immediately inside Next. A revision key also covers CLI
// content writes, which run outside the web server's incremental-cache context.
export async function getSeriRevision() {
  const payload = await getPayloadClient()
  const collections = ['products', 'articles', 'creators', 'media'] as const
  const [revisions, settings] = await Promise.all([
    Promise.all(
      collections.map(async (collection) => {
        const result = await payload.find({
          collection,
          overrideAccess: false,
          depth: 0,
          limit: 1,
          sort: '-updatedAt',
          select: { updatedAt: true },
        })
        return `${collection}:${result.totalDocs}:${result.docs[0]?.updatedAt || ''}`
      }),
    ),
    payload.findGlobal({
      slug: 'seri-settings',
      depth: 0,
      overrideAccess: false,
      select: { updatedAt: true },
    }),
  ])
  return [...revisions, settings.updatedAt || ''].join('|')
}
