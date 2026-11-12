import type { CollectionConfig } from 'payload'
import { ownAccount, staffField } from './seri-access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'name', group: 'Anggota SERI' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7, maxLoginAttempts: 8, lockTime: 600000 },
  access: {
    admin: () => false,
    create: () => true,
    read: ownAccount,
    update: ownAccount,
    delete: ownAccount,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data) {
          data.plan = 'free'
          data.phase = 'reset'
          data.programStartedAt = new Date().toISOString()
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const avatarID = typeof data.avatar === 'object' ? data.avatar?.id : data.avatar
        if (avatarID && avatarID !== originalDoc?.avatar) {
          const avatar = await req.payload.findByID({
            collection: 'avatars',
            id: avatarID,
            overrideAccess: false,
            user: req.user,
            req,
          })
          const owner = typeof avatar.owner === 'object' ? avatar.owner?.id : avatar.owner
          if (req.user?.collection !== 'users' || owner !== req.user.id) {
            throw new Error('Foto profil harus milik akunmu.')
          }
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        for (const collection of ['checkins', 'daily-routines', 'feedback', 'avatars'] as const) {
          const result = await req.payload.delete({
            collection,
            where: { owner: { equals: id } },
            overrideAccess: false,
            user: req.user,
            req,
          })
          if (result.errors.length)
            throw new Error(
              'Catatan terkait belum seluruhnya dihapus. Coba ulang penghapusan akun.',
            )
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 60 },
    { name: 'phone', type: 'text', maxLength: 24 },
    { name: 'avatar', type: 'upload', relationTo: 'avatars' },
    {
      name: 'plan',
      type: 'select',
      options: ['free', 'pro'],
      defaultValue: 'free',
      access: { create: staffField, update: staffField },
    },
    {
      name: 'phase',
      type: 'select',
      options: ['reset', 'pemulihan', 'penguatan'],
      defaultValue: 'reset',
      access: { create: staffField, update: staffField },
    },
    {
      name: 'programStartedAt',
      type: 'date',
      access: { create: staffField, update: staffField },
    },
    {
      name: 'skinProfile',
      type: 'group',
      fields: [
        {
          name: 'skinType',
          type: 'select',
          options: ['Belum diisi', 'Normal', 'Kering', 'Berminyak', 'Kombinasi', 'Sensitif'],
          defaultValue: 'Belum diisi',
        },
        {
          name: 'concerns',
          type: 'select',
          hasMany: true,
          options: ['Jerawat', 'Kemerahan', 'Kulit kering', 'Tekstur', 'Bekas jerawat', 'Kusam'],
        },
        { name: 'notes', type: 'textarea', maxLength: 500 },
        { name: 'completedAt', type: 'date' },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        { name: 'notifications', type: 'checkbox', defaultValue: false },
        { name: 'morningEnabled', type: 'checkbox', defaultValue: true },
        { name: 'morningTime', type: 'text', defaultValue: '06:30', validate: time },
        { name: 'eveningEnabled', type: 'checkbox', defaultValue: true },
        { name: 'eveningTime', type: 'text', defaultValue: '20:00', validate: time },
        { name: 'weeklyEnabled', type: 'checkbox', defaultValue: true },
        {
          name: 'weeklyDay',
          type: 'select',
          options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
          defaultValue: 'Minggu',
        },
      ],
    },
  ],
}
function time(value: unknown) {
  return (
    !value ||
    (typeof value === 'string' && /^([01]\d|2[01]):[0-5]\d$/.test(value) && value <= '21:30') ||
    'Pilih waktu paling lambat 21.30.'
  )
}
