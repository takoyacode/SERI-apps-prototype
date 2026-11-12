import type { User, Checkin, DailyRoutine } from '@/payload-types'

export type AccountUser = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'phone'
  | 'plan'
  | 'phase'
  | 'programStartedAt'
  | 'createdAt'
  | 'skinProfile'
  | 'preferences'
> & { avatarURL: string | null }
export type AccountData = {
  user: AccountUser | null
  checkins: Checkin[]
  routines: DailyRoutine[]
  checkinCount: number
}
export const emptyAccount: AccountData = { user: null, checkins: [], routines: [], checkinCount: 0 }
export type ScreenName =
  | 'Beranda'
  | 'Rutinitas'
  | 'Explore'
  | 'Profil Kamu'
  | 'Check-in'
  | 'Progres'
  | 'Tanya SERI'
export const routes: { name: ScreenName; href: string; icon: string }[] = [
  { name: 'Beranda', href: '/', icon: 'home' },
  { name: 'Rutinitas', href: '/rutinitas', icon: 'leaf' },
  { name: 'Explore', href: '/explore', icon: 'grid' },
  { name: 'Profil Kamu', href: '/profil', icon: 'user' },
]
export function localDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}
export function programDay(user: AccountUser | null) {
  if (!user?.programStartedAt) return 0
  const start = Date.parse(localDay(new Date(user.programStartedAt)))
  return Math.max(1, Math.floor((Date.parse(localDay()) - start) / 86400000) + 1)
}
export const moods = [
  { value: 'great', emoji: '😊', label: 'Nyaman sekali' },
  { value: 'good', emoji: '🙂', label: 'Cukup nyaman' },
  { value: 'okay', emoji: '😐', label: 'Biasa saja' },
  { value: 'sensitive', emoji: '😣', label: 'Agak sensitif' },
  { value: 'uncomfortable', emoji: '😢', label: 'Tidak nyaman' },
] as const
