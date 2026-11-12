import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'
import { contentChanged, contentDeleted } from '@/lib/seri-cache'
import { staff } from './seri-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: { afterChange: [contentChanged], afterDelete: [contentDeleted] },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
      return headers
    },
  },
}
