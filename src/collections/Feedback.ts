import type { CollectionConfig } from 'payload'
import { appUser, assignOwner, ownRecords, staff } from './seri-access'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  admin: { group: 'Anggota SERI', useAsTitle: 'category' },
  access: {
    create: appUser,
    read: (args) => (args.req.user?.collection === 'admins' ? true : ownRecords(args)),
    update: staff,
    delete: ownRecords,
  },
  hooks: { beforeValidate: [assignOwner] },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: { update: () => false },
    },
    { name: 'category', type: 'select', options: ['feedback', 'bantuan', 'pro'], required: true },
    { name: 'message', type: 'textarea', required: true, maxLength: 2000 },
  ],
}
