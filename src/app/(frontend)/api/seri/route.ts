import { appAuth, publicProfile } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { errorResponse, readInput, sameOrigin, secureRequest } from '@/lib/seri-request'
import { localDay, moods } from '@/lib/seri-types'
import type { User } from '@/payload-types'

export async function GET() {
  try {
    const user = await appAuth.currentUser()
    if (!user)
      return Response.json(
        { user: null, checkins: [], routines: [], checkinCount: 0 },
        { headers: { 'Cache-Control': 'private, no-store' } },
      )
    const payload = await getPayloadClient()
    const [profile, checkins, routines] = await Promise.all([
      payload.findByID({ collection: 'users', id: user.id, user, overrideAccess: false, depth: 1 }),
      payload.find({
        collection: 'checkins',
        user,
        overrideAccess: false,
        where: { owner: { equals: user.id } },
        limit: 100,
        sort: '-day',
        depth: 0,
      }),
      payload.find({
        collection: 'daily-routines',
        user,
        overrideAccess: false,
        where: { owner: { equals: user.id } },
        limit: 100,
        sort: '-day',
        depth: 0,
      }),
    ])
    return Response.json(
      {
        user: publicProfile(profile),
        checkins: checkins.docs,
        routines: routines.docs,
        checkinCount: checkins.totalDocs,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch {
    return errorResponse('Profil belum dapat dimuat. Coba lagi.', 503)
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse('Permintaan tidak diizinkan.', 403)
  const user = await appAuth.currentUser()
  if (!user) return errorResponse('Masuk dulu untuk menyimpan perjalananmu.', 401)
  let input
  try {
    input = await readInput(request)
  } catch {
    return errorResponse('Data formulir tidak valid.')
  }
  const payload = await getPayloadClient()
  try {
    if (input.operation === 'profile') {
      const data: Partial<User> = {}
      if ('name' in input) {
        if (
          typeof input.name !== 'string' ||
          input.name.trim().length < 2 ||
          input.name.trim().length > 60
        )
          return errorResponse('Nama harus 2–60 karakter.')
        data.name = input.name.trim()
      }
      if ('phone' in input) {
        if (typeof input.phone !== 'string' || !/^[+\d\s()-]{0,24}$/.test(input.phone))
          return errorResponse('Nomor telepon tidak valid.')
        data.phone = input.phone.trim()
      }
      if ('skinType' in input) {
        const types = ['Normal', 'Kering', 'Berminyak', 'Kombinasi', 'Sensitif'] as const
        if (!types.includes(input.skinType as (typeof types)[number]))
          return errorResponse('Pilih jenis kulit yang tersedia.')
        const allowed = [
          'Jerawat',
          'Kemerahan',
          'Kulit kering',
          'Tekstur',
          'Bekas jerawat',
          'Kusam',
        ] as const
        if (!Array.isArray(input.concerns) || !input.concerns.every((v) => allowed.includes(v)))
          return errorResponse('Keluhan kulit tidak valid.')
        data.skinProfile = {
          skinType: input.skinType as (typeof types)[number],
          concerns: input.concerns,
          completedAt: new Date().toISOString(),
        }
      }
      if ('preferences' in input) {
        const p = input.preferences as Record<string, unknown>
        if (!p || typeof p !== 'object') return errorResponse('Preferensi tidak valid.')
        const times = [p.morningTime, p.eveningTime]
        if (
          !times.every(
            (t) => typeof t === 'string' && /^([01]\d|2[01]):[0-5]\d$/.test(t) && t <= '21:30',
          )
        )
          return errorResponse('Pengingat harus sebelum atau pada pukul 21.30.')
        if (
          !['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].includes(
            String(p.weeklyDay),
          )
        )
          return errorResponse('Hari evaluasi tidak valid.')
        if (
          !['notifications', 'morningEnabled', 'eveningEnabled', 'weeklyEnabled'].every(
            (k) => typeof p[k] === 'boolean',
          )
        )
          return errorResponse('Preferensi pengingat tidak valid.')
        data.preferences = {
          notifications: p.notifications as boolean,
          morningEnabled: p.morningEnabled as boolean,
          eveningEnabled: p.eveningEnabled as boolean,
          weeklyEnabled: p.weeklyEnabled as boolean,
          morningTime: p.morningTime as string,
          eveningTime: p.eveningTime as string,
          weeklyDay: p.weeklyDay as NonNullable<User['preferences']>['weeklyDay'],
        }
      }
      if (!Object.keys(data).length)
        return errorResponse('Tidak ada perubahan yang dapat disimpan.')
      await payload.update({ collection: 'users', id: user.id, data, user, overrideAccess: false })
    } else if (input.operation === 'checkin') {
      if (!moods.some((m) => m.value === input.mood))
        return errorResponse('Pilih perasaan kulitmu hari ini.')
      const keys = ['redness', 'stinging', 'dryness', 'acne'] as const
      if (
        !keys.every(
          (k) => Number.isInteger(input[k]) && Number(input[k]) >= 0 && Number(input[k]) <= 3,
        )
      )
        return errorResponse('Setiap skor harus 0–3.')
      if (
        typeof input.note !== 'string' ||
        input.note.length > 1500 ||
        typeof input.reaction !== 'boolean' ||
        typeof input.redFlag !== 'boolean'
      )
        return errorResponse('Catatan atau reaksi tidak valid.')
      const day = localDay()
      const existing = await payload.find({
        collection: 'checkins',
        user,
        overrideAccess: false,
        where: { and: [{ owner: { equals: user.id } }, { day: { equals: day } }] },
        limit: 1,
        depth: 0,
      })
      const data = {
        day,
        owner: user.id,
        mood: input.mood as 'great',
        redness: Number(input.redness),
        stinging: Number(input.stinging),
        dryness: Number(input.dryness),
        acne: Number(input.acne),
        reaction: input.reaction,
        redFlag: input.redFlag,
        note: input.note.trim(),
      }
      if (existing.docs[0])
        await payload.update({
          collection: 'checkins',
          id: existing.docs[0].id,
          data,
          user,
          overrideAccess: false,
        })
      else await payload.create({ collection: 'checkins', data, user, overrideAccess: false })
    } else if (input.operation === 'routine') {
      if (
        !['morning', 'evening'].includes(String(input.period)) ||
        typeof input.completed !== 'boolean'
      )
        return errorResponse('Rutinitas tidak valid.')
      const day = localDay()
      const existing = await payload.find({
        collection: 'daily-routines',
        user,
        overrideAccess: false,
        where: { and: [{ owner: { equals: user.id } }, { day: { equals: day } }] },
        limit: 1,
        depth: 0,
      })
      const data = { owner: user.id, day, [String(input.period)]: input.completed }
      if (existing.docs[0])
        await payload.update({
          collection: 'daily-routines',
          id: existing.docs[0].id,
          data,
          user,
          overrideAccess: false,
        })
      else await payload.create({ collection: 'daily-routines', data, user, overrideAccess: false })
    } else if (input.operation === 'feedback') {
      if (
        !['feedback', 'bantuan', 'pro'].includes(String(input.category)) ||
        typeof input.message !== 'string' ||
        input.message.trim().length < 5 ||
        input.message.length > 2000
      )
        return errorResponse('Tulis pesan antara 5–2000 karakter.')
      await payload.create({
        collection: 'feedback',
        user,
        overrideAccess: false,
        data: {
          owner: user.id,
          category: input.category as 'feedback',
          message: input.message.trim(),
        },
      })
    } else if (input.operation === 'delete') {
      if (input.confirmation !== 'HAPUS' || typeof input.password !== 'string')
        return errorResponse('Konfirmasi penghapusan dan kata sandi diperlukan.')
      try {
        await payload.login({
          collection: 'users',
          data: { email: user.email, password: input.password },
        })
      } catch {
        return errorResponse('Kata sandi tidak cocok.')
      }
      await payload.delete({ collection: 'users', id: user.id, user, overrideAccess: false })
      await appAuth.logout(secureRequest(request))
    } else return errorResponse('Operasi tidak dikenal.')
    return Response.json({ ok: true })
  } catch (error) {
    console.error(
      'SERI account operation failed:',
      error instanceof Error ? error.name : 'UnknownError',
      error instanceof Error && error.name === 'QueryError' ? error.message : '',
    )
    return errorResponse('Perubahan belum tersimpan. Periksa isianmu dan coba lagi.', 400)
  }
}
