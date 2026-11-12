import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { errorResponse, sameOrigin } from '@/lib/seri-request'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse('Permintaan tidak diizinkan.', 403)
  const user = await appAuth.currentUser()
  if (!user) return errorResponse('Masuk dulu untuk mengubah foto.', 401)
  try {
    const form = await request.formData()
    const file = form.get('photo')
    if (
      !(file instanceof File) ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 2 * 1024 * 1024 ||
      file.size < 1
    )
      return errorResponse('Pilih JPG, PNG, atau WebP maksimal 2 MB.')
    if (form.get('consent') !== 'true')
      return errorResponse('Setujui penggunaan foto profil publik terlebih dahulu.')
    const payload = await getPayloadClient()
    const avatar = await payload.create({
      collection: 'avatars',
      overrideAccess: false,
      user,
      data: { owner: user.id, alt: `Foto profil ${user.name}` },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: `profile-${Date.now()}.${file.type.split('/')[1]}`,
        size: file.size,
      },
    })
    await payload.update({
      collection: 'users',
      id: user.id,
      user,
      overrideAccess: false,
      data: { avatar: avatar.id },
    })
    return Response.json({ ok: true })
  } catch {
    return errorResponse('Foto belum dapat disimpan. Coba gambar lain.')
  }
}
