import type { CollectionConfig, Field } from 'payload'
import { appUser, assignOwner, ownRecords } from './seri-access'

const scoreField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'number',
  min: 0,
  max: 3,
  required: true,
  validate: (value: unknown) =>
    (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 3) ||
    'Nilai harus 0–3.',
})
export const Checkins: CollectionConfig = {
  slug: 'checkins',
  admin: { group: 'Anggota SERI', useAsTitle: 'day' },
  access: { create: appUser, read: ownRecords, update: ownRecords, delete: ownRecords },
  hooks: {
    beforeValidate: [assignOwner],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const owner = originalDoc?.owner ?? req.user?.id
        const ownerID = typeof owner === 'object' ? owner?.id : owner
        const day = data.day || originalDoc?.day
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '') || !Number.isFinite(Date.parse(day))) {
          throw new Error('Tanggal check-in tidak valid.')
        }
        data.entryKey = `${ownerID}:${day}`
        data.score = ['redness', 'stinging', 'dryness', 'acne'].reduce(
          (total, key) => total + Number(data[key] ?? originalDoc?.[key] ?? 0),
          0,
        )
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
    { name: 'day', type: 'text', required: true, index: true },
    {
      name: 'mood',
      type: 'select',
      required: true,
      options: ['great', 'good', 'okay', 'sensitive', 'uncomfortable'],
    },
    scoreField('redness', 'Kemerahan'),
    scoreField('stinging', 'Perih'),
    scoreField('dryness', 'Kering'),
    scoreField('acne', 'Jerawat meradang'),
    { name: 'score', type: 'number', access: { create: () => false, update: () => false } },
    { name: 'reaction', type: 'checkbox', defaultValue: false },
    { name: 'redFlag', type: 'checkbox', defaultValue: false },
    { name: 'note', type: 'textarea', maxLength: 1500 },
  ],
}
