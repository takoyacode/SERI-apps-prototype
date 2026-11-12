import type { CollectionConfig } from 'payload'
import { staff, httpsURL } from './seri-access'
import { contentChanged, contentDeleted } from '@/lib/seri-cache'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { group: 'Konten SERI', useAsTitle: 'title' },
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
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    {
      name: 'category',
      type: 'select',
      options: ['Skin barrier', 'Ingredients', 'Rutinitas', 'Sun protection'],
      required: true,
    },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'readMinutes', type: 'number', defaultValue: 3, min: 1 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'creator', type: 'relationship', relationTo: 'creators' },
    { name: 'sourceURL', type: 'text', validate: httpsURL },
    { name: 'photoCredit', type: 'text' },
  ],
}
