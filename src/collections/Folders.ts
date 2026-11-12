import type { CollectionConfig } from 'payload'
import { staff } from './seri-access'

export const Folders: CollectionConfig = {
  slug: 'folders',
  access: { create: staff, read: staff, update: staff, delete: staff },
  admin: {
    useAsTitle: 'name',
  },
  folders: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
