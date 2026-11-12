import type { CollectionConfig } from 'payload'
import { staff } from './seri-access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: { create: staff, read: staff, update: staff, delete: staff },
  admin: {
    useAsTitle: 'name',
  },
  tags: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
