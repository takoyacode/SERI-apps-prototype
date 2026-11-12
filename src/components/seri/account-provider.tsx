'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { emptyAccount, localDay, type AccountData } from '@/lib/seri-types'
import type { Article, Creator, Product } from '@/payload-types'
import { Icon } from './icon'

export type DialogState = {
  type: string
  product?: Product
  article?: Article
  creator?: Creator
} | null
type Result = { ok: boolean; error?: string; fields?: Record<string, string> }
type AccountContextValue = {
  account: AccountData
  loading: boolean
  busy: boolean
  loadError: string
  dialog: DialogState
  open: (dialog: DialogState) => void
  notify: (text: string) => void
  refresh: () => Promise<void>
  mutate: (input: Record<string, unknown>, path?: string) => Promise<Result>
}
const AccountContext = createContext<AccountContextValue | null>(null)
export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountData>(emptyAccount)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [dialog, open] = useState<DialogState>(null)
  const [toast, notify] = useState('')
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/seri', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Profil belum dapat dimuat.')
      setAccount(data)
      setLoadError('')
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Koneksi belum tersedia.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
  }, [refresh])
  useEffect(() => {
    const user = account.user
    const preferences = user?.preferences
    if (!user || !preferences?.notifications) return
    const delivered = new Set<string>()
    const check = () => {
      const now = new Date()
      const time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      }).format(now)
      const weekday = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        timeZone: 'Asia/Jakarta',
      }).format(now)
      if (time > '21:30') return
      const reminders = [
        {
          key: 'morning',
          due: preferences.morningEnabled && time === preferences.morningTime,
          text: 'Awali hari dengan sedikit perhatian untuk dirimu. Rutinitas pagimu menanti.',
        },
        {
          key: 'evening',
          due: preferences.eveningEnabled && time === preferences.eveningTime,
          text: 'Waktu untuk melambat. Yuk, rawat dirimu dan catat check-in malam.',
        },
        {
          key: 'weekly',
          due: preferences.weeklyEnabled && weekday === preferences.weeklyDay && time === '20:00',
          text: 'Luangkan waktu untuk melihat kembali perjalanan kulitmu minggu ini.',
        },
      ]
      for (const reminder of reminders) {
        if (!reminder.due) continue
        const key = `seri-reminder:${user.id}:${localDay()}:${reminder.key}`
        if (delivered.has(key)) continue
        try {
          if (localStorage.getItem(key)) continue
          localStorage.setItem(key, 'sent')
        } catch {
          /* In-memory deduplication covers browsers without storage. */
        }
        delivered.add(key)
        notify(reminder.text)
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('SERI · Pengingat lembut', { body: reminder.text, tag: key })
          } catch {
            /* The in-app reminder remains available when the browser blocks notifications. */
          }
        }
      }
    }
    check()
    const timer = setInterval(check, 30000)
    return () => clearInterval(timer)
  }, [account.user?.id, account.user?.preferences])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => notify(''), 5000)
    return () => clearTimeout(timer)
  }, [toast])
  async function mutate(input: Record<string, unknown>, path = '/api/seri'): Promise<Result> {
    setBusy(true)
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const result = await response.json()
      if (!response.ok || !result.ok)
        return {
          ok: false,
          error: result.error || 'Perubahan belum tersimpan.',
          fields: result.fields,
        }
      await refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'Koneksi terputus. Coba lagi, ya.' }
    } finally {
      setBusy(false)
    }
  }
  return (
    <AccountContext.Provider
      value={{ account, loading, busy, loadError, dialog, open, notify, refresh, mutate }}
    >
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[100] flex w-max max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/20 bg-espresso px-5 py-4 text-sm text-cream shadow-xl md:bottom-7"
        >
          <Icon name="check" size={18} />
          <span>{toast}</span>
          <button className="ml-2 p-1" aria-label="Tutup pemberitahuan" onClick={() => notify('')}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
    </AccountContext.Provider>
  )
}
export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error('AccountProvider is missing.')
  return context
}
