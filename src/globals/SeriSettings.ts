import type { GlobalConfig } from 'payload'
import { staff } from '@/collections/seri-access'
import { settingsChanged } from '@/lib/seri-cache'

export const SeriSettings: GlobalConfig = {
  slug: 'seri-settings',
  label: 'Beranda SERI',
  access: { read: () => true, update: staff },
  hooks: { afterChange: [settingsChanged] },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Kulitmu punya cerita.\nKita rawat bersama.' },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'Pelan-pelan, satu langkah kecil setiap hari. SERI menemani perjalananmu menuju kulit yang lebih nyaman.',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'advice',
      type: 'textarea',
      defaultValue:
        'Kamu tidak perlu kulit yang sempurna untuk merasa berharga. Merawat diri adalah bentuk sayang, bukan tuntutan.',
    },
  ],
}
