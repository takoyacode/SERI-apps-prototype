import type { CollectionConfig } from 'payload'
import { staff, httpsURL } from './seri-access'
import { contentChanged, contentDeleted } from '@/lib/seri-cache'

export const Creators: CollectionConfig = {
  slug: 'creators',
  admin: { group: 'Konten SERI', useAsTitle: 'name' },
  access: { read: () => true, create: staff, update: staff, delete: staff },
  hooks: { afterChange: [contentChanged], afterDelete: [contentDeleted] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'expertise', type: 'text', required: true },
    { name: 'initials', type: 'text', maxLength: 3 },
    { name: 'channel', type: 'text', required: true, validate: httpsURL },
    {
      name: 'platform',
      type: 'select',
      options: ['YouTube', 'Instagram', 'TikTok'],
      required: true,
    },
    { name: 'description', type: 'textarea' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
  ],
}
