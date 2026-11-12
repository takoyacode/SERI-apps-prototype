import type { CollectionConfig } from 'payload'
import { appUser, assignOwner, ownRecords } from './seri-access'

export const DailyRoutines: CollectionConfig = {
  slug: 'daily-routines',
  admin: { group: 'Anggota SERI', useAsTitle: 'day' },
  access: { create: appUser, read: ownRecords, update: ownRecords, delete: ownRecords },
  hooks: {
    beforeValidate: [assignOwner],
    beforeChange: [
      ({ data, req, originalDoc }) => {
        const owner = originalDoc?.owner ?? req.user?.id
        const id = typeof owner === 'object' ? owner?.id : owner
        const day = data.day || originalDoc?.day
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) throw new Error('Tanggal tidak valid.')
        data.entryKey = `${id}:${day}`
        return data
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: () => false },
    },
    {
      name: 'entryKey',
      type: 'text',
      unique: true,
      access: { create: () => false, update: () => false },
      admin: { hidden: true },
    },
    { name: 'day', type: 'text', required: true },
    { name: 'morning', type: 'checkbox', defaultValue: false },
    { name: 'evening', type: 'checkbox', defaultValue: false },
  ],
}
