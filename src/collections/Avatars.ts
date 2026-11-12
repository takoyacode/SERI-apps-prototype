import type { CollectionConfig } from 'payload'
import { appUser, assignOwner, ownRecords } from './seri-access'

export const Avatars: CollectionConfig = {
  slug: 'avatars',
  admin: { group: 'Anggota SERI' },
  access: { read: () => true, create: appUser, update: ownRecords, delete: ownRecords },
  hooks: { beforeValidate: [assignOwner] },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: () => false },
    },
    { name: 'alt', type: 'text', required: true, maxLength: 100 },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
      return headers
    },
  },
}
