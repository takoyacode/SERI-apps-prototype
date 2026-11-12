import 'server-only'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { AccountUser } from '@/lib/seri-types'
import type { User } from '@/payload-types'

const COOKIE = 'app-session'
const MAX_AGE = 60 * 60 * 24 * 7
export function createAppAuth(collection: 'users') {
  return {
    async currentUser() {
      const token = (await cookies()).get(COOKIE)?.value
      if (!token) return null
      const payload = await getPayloadClient()
      const { user } = await payload.auth({
        headers: new Headers({ Authorization: `JWT ${token}` }),
      })
      if (!user || user.collection !== collection) return null
      return user
    },
    async login(email: string, password: string, secure: boolean) {
      const payload = await getPayloadClient()
      const result = await payload.login({ collection, data: { email, password } })
      if (!result.token) throw new Error('Sesi tidak dapat dibuat.')
      ;(await cookies()).set(COOKIE, result.token, {
        httpOnly: true,
        path: '/',
        sameSite: secure ? 'none' : 'lax',
        secure,
        partitioned: secure,
        maxAge: MAX_AGE,
      })
    },
    async logout(secure: boolean) {
      ;(await cookies()).set(COOKIE, '', {
        httpOnly: true,
        path: '/',
        sameSite: secure ? 'none' : 'lax',
        secure,
        partitioned: secure,
        maxAge: 0,
      })
    },
  }
}
export const appAuth = createAppAuth('users')
export function publicProfile(user: User): AccountUser {
  const avatar = user.avatar && typeof user.avatar === 'object' ? user.avatar : null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    plan: user.plan,
    phase: user.phase,
    programStartedAt: user.programStartedAt,
    createdAt: user.createdAt,
    skinProfile: user.skinProfile,
    preferences: user.preferences,
    avatarURL: avatar?.url || null,
  }
}
