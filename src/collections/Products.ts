import type { CollectionConfig } from 'payload'
import { staff, httpsURL } from './seri-access'
import { contentChanged, contentDeleted } from '@/lib/seri-cache'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', group: 'Konten SERI' },
  versions: { drafts: true },
  access: {
    read: ({ req }) =>
      req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } },
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: { afterChange: [contentChanged], afterDelete: [contentDeleted] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'brand', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    {
      name: 'category',
      type: 'select',
      options: ['Pembersih', 'Pelembap', 'Sunscreen'],
      required: true,
    },
    {
      name: 'period',
      type: 'select',
      options: ['both', 'morning', 'evening'],
      defaultValue: 'both',
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'size', type: 'text' },
    { name: 'description', type: 'textarea', required: true },
    { name: 'ingredients', type: 'textarea', required: true },
    { name: 'composition', type: 'textarea', required: true },
    { name: 'reason', type: 'textarea', required: true },
    { name: 'usage', type: 'textarea' },
    { name: 'estimatedPrice', type: 'number', min: 0 },
    { name: 'priceNote', type: 'text' },
    { name: 'priceCheckedAt', type: 'date' },
    { name: 'officialURL', type: 'text', validate: httpsURL },
    {
      name: 'shopeeURL',
      type: 'text',
      validate: (v: unknown) => marketplace(v, ['shopee.co.id', 's.shopee.co.id', 'shope.ee']),
    },
    {
      name: 'tiktokURL',
      type: 'text',
      validate: (v: unknown) => marketplace(v, ['tiktok.com', 'shop.tiktok.com', 'vt.tiktok.com']),
    },
    { name: 'officialStoreVerified', type: 'checkbox', defaultValue: false },
    { name: 'affiliate', type: 'checkbox', defaultValue: false },
  ],
}
function marketplace(value: unknown, domains: string[]) {
  if (!value) return true
  try {
    const url = new URL(String(value))
    return (
      (url.protocol === 'https:' &&
        domains.some((d) => url.hostname === d || url.hostname.endsWith(`.${d}`))) ||
      'Gunakan tautan marketplace yang sesuai.'
    )
  } catch {
    return 'Tautan tidak valid.'
  }
}
