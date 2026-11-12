'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { routes } from '@/lib/seri-types'
import { useAccount } from './account-provider'
import { Avatar, Eyebrow } from './ui'
import { Icon } from './icon'
import { DialogManager } from './dialogs'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { account, open, loadError, refresh } = useAccount()
  const active =
    routes.find((n) => n.href === pathname)?.name ||
    ({ '/check-in': 'Daily check-in', '/progres': 'Progres kulitmu', '/tanya': 'Tanya SERI AI' }[
      pathname
    ] ??
      'SERI')
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[218px] flex-col border-r border-white/70 bg-[#fffcf7]/65 px-5 pb-5 pt-9 backdrop-blur-2xl lg:flex xl:w-[236px] xl:px-6">
        <Link href="/" aria-label="SERI beranda" className="flex w-fit items-center gap-2.5 pl-3">
          <span className="font-serif text-[52px] leading-none tracking-[-3px]">seri</span>
          <span className="mt-1 text-gold">
            <Icon name="spark" size={25} />
          </span>
        </Link>
        <p className="mt-3 pl-3 text-[9px] tracking-[.09em] text-[#a18b77]">
          teman bertumbuh bersama kulitmu
        </p>
        <Eyebrow className="mb-4 mt-12 pl-3 text-[#aa9683]">Ruang untuk dirimu</Eyebrow>
        <nav className="flex flex-col gap-2" aria-label="Navigasi utama desktop">
          {routes.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`group flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] transition ${pathname === n.href ? 'bg-espresso text-cream shadow-[0_5px_15px_#4b2d1a12]' : 'text-[#8a7666] hover:bg-white/70'}`}
            >
              <Icon name={n.icon} size={20} />
              {n.name}
              {pathname === n.href && (
                <span className="ml-auto size-1 rounded-full bg-gold-light" />
              )}
            </Link>
          ))}
        </nav>
        <Link
          href="/tanya"
          className="mt-7 flex items-center gap-3 rounded-2xl border border-[#d4c5af]/50 bg-[#ebe3d6]/40 p-4 transition hover:bg-white/60"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e6d6b8] text-[#8e6b36]">
            <Icon name="spark" size={21} />
          </span>
          <span>
            <strong className="block text-[11px] font-medium">Tanya SERI AI</strong>
            <span className="mt-1 block text-[9px] text-muted">Ada teman untuk ceritamu</span>
          </span>
          <Icon className="ml-auto text-[#9d8972]" name="diagonal" size={15} />
        </Link>
        <div className="mt-auto pt-10">
          <div className="relative mb-6 overflow-hidden rounded-[23px] border border-white/90 bg-gradient-to-br from-[#e8ded0]/60 to-white/20 p-5">
            <span className="flex size-9 items-center justify-center text-[#bda174]">
              <Icon name="leaf" size={30} />
            </span>
            <p className="mt-3 font-serif text-[21px] leading-snug">
              Good skin takes
              <br />a little kindness.
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-[#9d8977]">
              Untuk kulitmu.
              <br />
              Dan untuk dirimu sendiri.
            </p>
            <span className="pointer-events-none absolute -bottom-10 -right-8 text-[#cdbca4]/25">
              <Icon name="leaf" size={135} />
            </span>
          </div>
          <button
            onClick={() => open({ type: 'help' })}
            className="flex min-h-11 w-full items-center gap-3 px-3 text-xs text-muted"
          >
            <Icon name="help" size={18} />
            Bantuan & masukan
            <Icon name="diagonal" size={14} className="ml-auto" />
          </button>
          <button
            onClick={() => (account.user ? router.push('/profil') : open({ type: 'auth' }))}
            className="mt-5 flex w-full items-center gap-3 border-t border-[#d9cabb]/40 px-1 pt-5 text-left"
          >
            <Avatar />
            <span>
              <strong className="block text-xs font-medium">
                {account.user?.name || 'Ruang pribadimu'}
              </strong>
              <span className="mt-1 block text-[9px] text-muted">
                {account.user ? 'Perjalanan kulitku' : 'Masuk untuk mulai'}
              </span>
            </span>
            <Icon name="chevron" className="ml-auto text-muted" size={16} />
          </button>
        </div>
      </aside>
      <div className="lg:ml-[218px] xl:ml-[236px]">
        <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-white/60 bg-[#fffaf4]/30 px-5 backdrop-blur-lg md:px-8 xl:px-10">
          <div className="hidden items-center gap-3 text-[11px] text-[#a18b79] lg:flex">
            <Icon name="leaf" size={16} />
            <span>Ruang untuk bertumbuh</span>
            <Icon name="chevron" size={12} />
            <span className="text-[#614d3d]">{active}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-[36px] tracking-[-2px] lg:hidden"
          >
            seri
            <Icon name="spark" size={21} className="text-gold" />
          </Link>
          <div className="flex items-center gap-5 md:gap-6">
            <span className="hidden items-center gap-1.5 text-[10px] text-[#a18b79] md:flex">
              <Icon name="shield" size={14} />
              Sedikit perawatan. Banyak kasih sayang.
            </span>
            <button
              aria-label="Buka pengingat"
              onClick={() => open({ type: 'reminders' })}
              className="relative p-2 text-[#806953]"
            >
              <Icon name="bell" size={20} />
              <span className="absolute right-2 top-1.5 size-1.5 rounded-full border border-cream bg-gold" />
            </button>
            <button aria-label="Buka profil kamu" onClick={() => router.push('/profil')}>
              <Avatar />
            </button>
          </div>
        </header>
        {loadError && (
          <div
            role="alert"
            className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#dfb99a] bg-[#fff0db] px-4 py-3 text-xs text-[#80552d]"
          >
            {loadError}
            <button onClick={() => void refresh()} className="shrink-0 font-semibold underline">
              Coba lagi
            </button>
          </div>
        )}
        <main
          id="main-content"
          className="mx-auto max-w-[1420px] px-5 pb-28 pt-7 md:px-8 md:pt-9 lg:pb-7 xl:px-10"
        >
          {children}
          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#d9cabb]/40 py-6 text-[9px] text-[#ab9783] sm:flex-row">
            <span className="flex items-center gap-1.5">
              <Icon name="heart" size={13} />
              Dibuat untuk menemani, bukan menghakimi.
            </span>
            <button
              className="text-center hover:text-espresso"
              onClick={() => open({ type: 'about' })}
            >
              SERI bukan pengganti konsultasi dokter.
            </button>
          </footer>
        </main>
      </div>
      <nav
        aria-label="Navigasi utama ponsel"
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-[520px] justify-around rounded-[27px] border border-white/90 bg-[#fffcf5]/85 px-3 py-2.5 shadow-[0_6px_30px_#4b2f1f15,inset_0_1px_0_#ffffff] backdrop-blur-2xl lg:hidden"
      >
        {routes.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-1 text-[9px] font-medium transition ${pathname === n.href ? 'bg-espresso text-gold-light' : 'text-[#a18b77]'}`}
          >
            <Icon name={n.icon} size={20} />
            {n.name}
          </Link>
        ))}
      </nav>
      <DialogManager />
    </div>
  )
}
