'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from './account-provider'
import { Icon } from './icon'
import {
  inputClass,
  primaryButton,
  lightButton,
  Eyebrow,
  IconBox,
  ProductIllustration,
  MediaImage,
} from './ui'
import type { Article, Creator, Product } from '@/payload-types'

export function DialogManager() {
  const { dialog, open } = useAccount()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!dialog) return
    const el = ref.current
    const focus = document.activeElement as HTMLElement | null
    const oldOverflow = document.body.style.overflow
    el?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      el?.close()
      document.body.style.overflow = oldOverflow
      focus?.focus()
    }
  }, [dialog?.type])
  if (!dialog) return null
  return (
    <dialog
      ref={ref}
      aria-labelledby="seri-dialog-title"
      onCancel={() => open(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) open(null)
      }}
      className={`fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-[560px] overflow-auto overscroll-contain rounded-[28px] border border-white/80 p-0 text-espresso shadow-[0_20px_100px_#291b1633] backdrop:bg-[#322418]/40 backdrop:backdrop-blur-md ${dialog.type === 'pro' ? 'bg-[#2e1d14]' : 'bg-[#fcf8f0]'}`}
    >
      <button
        autoFocus
        aria-label="Tutup dialog"
        onClick={() => open(null)}
        className={`absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full border transition ${dialog.type === 'pro' ? 'border-[#c6ae78]/20 bg-white/5 text-gold-light' : 'border-white/90 bg-[#fcf8f0]/80 text-[#a78c6f] hover:bg-white'}`}
      >
        <Icon name="close" size={19} />
      </button>
      <div key={dialog.type} className="p-6 pt-7 sm:p-8">
        {dialog.type === 'auth' ? (
          <AuthDialog />
        ) : dialog.type === 'product' && dialog.product ? (
          <ProductDialog product={dialog.product} />
        ) : dialog.type === 'article' && dialog.article ? (
          <ArticleDialog article={dialog.article} />
        ) : dialog.type === 'creator' && dialog.creator ? (
          <CreatorDialog creator={dialog.creator} />
        ) : dialog.type === 'profile' ? (
          <ProfileDialog />
        ) : dialog.type === 'skin' ? (
          <SkinDialog />
        ) : dialog.type === 'notifications' || dialog.type === 'reminders' ? (
          <PreferencesDialog />
        ) : dialog.type === 'privacy' ? (
          <PrivacyDialog />
        ) : dialog.type === 'help' ? (
          <HelpDialog />
        ) : dialog.type === 'pro' ? (
          <ProDialog />
        ) : dialog.type === 'delete' ? (
          <DeleteDialog />
        ) : dialog.type === 'signout' ? (
          <SignoutDialog />
        ) : dialog.type === 'avatar' ? (
          <AvatarDialog />
        ) : dialog.type === 'google' ? (
          <GoogleDialog />
        ) : dialog.type === 'safety' ? (
          <SafetyDialog />
        ) : (
          <AboutDialog />
        )}
      </div>
    </dialog>
  )
}
function Intro({ title, sub, icon = 'leaf' }: { title: string; sub?: string; icon?: string }) {
  return (
    <div className="mb-6 pr-7">
      <IconBox name={icon} />
      <h2
        id="seri-dialog-title"
        className="mt-5 font-serif text-[30px] leading-tight tracking-[-.5px]"
      >
        {title}
      </h2>
      {sub && <p className="mt-3 text-xs leading-[1.9] text-muted">{sub}</p>}
    </div>
  )
}
function ErrorText({ text }: { text: string }) {
  return text ? (
    <p
      role="alert"
      className="mt-4 rounded-xl border border-[#e4c4ac] bg-[#f8eade] p-3 text-xs leading-relaxed text-[#9b684b]"
    >
      {text}
    </p>
  ) : null
}
function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[10px] leading-relaxed text-muted">{hint}</span>}
    </label>
  )
}
function AuthDialog() {
  const { mutate, busy, open, notify } = useAccount()
  const [register, setRegister] = useState(false)
  const [error, setError] = useState('')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const result = await mutate(
      {
        operation: register ? 'register' : 'login',
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        consent: form.get('consent') === 'on',
      },
      '/api/seri/auth',
    )
    if (!result.ok) return setError(result.error!)
    notify(
      register ? 'Selamat datang di SERI. Kita mulai pelan-pelan, ya.' : 'Senang kamu kembali.',
    )
    open(register ? { type: 'skin' } : null)
  }
  return (
    <>
      <Intro
        title={register ? 'Cerita barumu dimulai di sini.' : 'Senang bertemu kamu lagi.'}
        sub="Simpan catatan kulitmu secara privat, lanjutkan perjalananmu dari perangkat mana pun."
        icon="heart"
      />
      <div className="mb-6 flex rounded-full border border-white bg-[#ece2d4]/55 p-1">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            onClick={() => {
              setRegister(v)
              setError('')
            }}
            className={`min-h-10 flex-1 rounded-full text-xs transition ${register === v ? 'bg-espresso text-cream' : 'text-muted'}`}
          >
            {v ? 'Buat akun' : 'Masuk'}
          </button>
        ))}
      </div>
      <form onSubmit={submit}>
        {register && (
          <Field label="Nama panggilan">
            <input
              name="name"
              autoComplete="given-name"
              required
              minLength={2}
              maxLength={60}
              className={inputClass}
              placeholder="Kami memanggilmu..."
            />
          </Field>
        )}
        <Field label="Alamat email">
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            className={inputClass}
            placeholder="nama@email.com"
          />
        </Field>
        <Field label="Kata sandi" hint="Minimal 10 karakter.">
          <input
            name="password"
            type="password"
            autoComplete={register ? 'new-password' : 'current-password'}
            required
            minLength={10}
            maxLength={128}
            className={inputClass}
            placeholder="Kata sandi pribadimu"
          />
        </Field>
        {register && (
          <label className="flex items-start gap-3 text-[10px] leading-relaxed text-muted">
            <input name="consent" type="checkbox" required className="mt-1 accent-[#99783e]" />
            <span>
              Saya menyetujui penyimpanan profil dan catatan kulit untuk keperluan akun SERI.
              Informasi ini bukan pengganti konsultasi dokter.
            </span>
          </label>
        )}
        <ErrorText text={error} />
        <button disabled={busy} className={`${primaryButton} mt-6 w-full`}>
          {busy ? 'Sebentar, ya...' : register ? 'Mulai perjalanan kulitku' : 'Masuk ke ruangku'}
          <Icon name="arrow" size={17} />
        </button>
      </form>
      <p className="mt-4 text-center text-[9px] leading-relaxed text-muted">
        Akun ini terpisah dari akun Figma dan admin CMS.
      </p>
    </>
  )
}
function ProductDialog({ product: p }: { product: Product }) {
  const [tab, setTab] = useState('Kenali')
  const verified = p.officialStoreVerified
  return (
    <>
      <div className="mb-6 pt-7">
        <ProductIllustration product={p} small />
      </div>
      <Eyebrow className="text-gold-dark">
        {p.brand} · {p.category} · {p.size}
      </Eyebrow>
      <h2 id="seri-dialog-title" className="mt-2 font-serif text-[33px] leading-tight">
        {p.name}
      </h2>
      <div className="mb-5 mt-5 flex border-b border-line">
        {['Kenali', 'Ingredients', 'Beli produk'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`min-h-11 flex-1 border-b-2 pb-3 text-xs ${t === tab ? 'border-gold text-gold-dark' : 'border-transparent text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Kenali' ? (
        <div className="space-y-5 text-xs leading-[1.9] text-muted">
          <p>{p.description}</p>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#7c644c]">
              Kenapa ada di katalog SERI?
            </h3>
            <p>{p.reason}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#7c644c]">Cara pakai</h3>
            <p>{p.usage || 'Ikuti petunjuk di kemasan produk.'}</p>
          </div>
          <div className="flex gap-2 rounded-xl border border-white bg-[#eee7d9]/60 p-4 text-[10px]">
            <Icon name="shield" size={17} className="mt-1 shrink-0" />
            <p>
              Ini pilihan edukatif, bukan rekomendasi medis personal. Untuk obat dokter dan kondisi
              khusus, ikuti arahan tenaga kesehatan.
            </p>
          </div>
        </div>
      ) : tab === 'Ingredients' ? (
        <div className="space-y-5 text-xs leading-[1.9] text-muted">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#7c644c]">Ingredients & fungsinya</h3>
            <p>{p.ingredients}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#7c644c]">Komposisi formula</h3>
            <p>{p.composition}</p>
          </div>
          <p className="border-t border-line pt-4 text-[10px]">
            SERI tidak mengarang persentase bahan yang tidak dipublikasikan. Selalu cek kemasan dan
            informasi terbaru dari brand.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-end justify-between rounded-2xl border border-white bg-[#eee3d2]/50 p-5">
            <span>
              <span className="block text-[10px] text-muted">Perkiraan harga</span>
              <strong className="mt-2 block font-serif text-3xl">
                {p.estimatedPrice
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(p.estimatedPrice)
                  : 'Cek toko'}
              </strong>
            </span>
            <span className="text-[9px] text-gold-dark">{p.size}</span>
          </div>
          <p className="mb-4 text-[10px] leading-relaxed text-muted">
            {p.priceNote || 'Harga final mengikuti toko, varian, dan promo.'}
            {p.priceCheckedAt
              ? ` Terakhir diperiksa ${new Date(p.priceCheckedAt).toLocaleDateString('id-ID')}.`
              : ' Harga live belum terhubung.'}
          </p>
          <div className="flex flex-col gap-3">
            {verified && p.shopeeURL && (
              <a
                href={p.shopeeURL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={primaryButton}
              >
                Shopee Official Store
                <Icon name="diagonal" size={16} />
              </a>
            )}
            {verified && p.tiktokURL && (
              <a
                href={p.tiktokURL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={primaryButton}
              >
                TikTok Official Store
                <Icon name="diagonal" size={16} />
              </a>
            )}
            {p.officialURL && (
              <a
                href={p.officialURL}
                target="_blank"
                rel="noopener noreferrer"
                className={lightButton}
              >
                Buka situs resmi brand
                <Icon name="diagonal" size={16} />
              </a>
            )}
          </div>
          {!(verified && (p.shopeeURL || p.tiktokURL)) && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#deceb5] p-4 text-[10px] leading-relaxed text-[#a0875e]">
              <Icon name="shield" size={17} className="mt-0.5 shrink-0" />
              <p>
                Tautan Shopee/TikTok official store dan affiliate belum diverifikasi. SERI tidak
                membuat tautan toko atau harga terbaru rekaan. Sementara itu, periksa kanal resmi
                brand.
              </p>
            </div>
          )}
          <p className="mt-4 text-[9px] leading-relaxed text-muted">
            {p.affiliate
              ? 'Tautan berlabel affiliate dapat memberi komisi kepada SERI tanpa biaya tambahan bagimu.'
              : 'Belum ada tautan affiliate aktif untuk produk ini.'}
          </p>
        </div>
      )}
    </>
  )
}
function ArticleDialog({ article }: { article: Article }) {
  return (
    <>
      <div className="relative -mx-6 -mt-7 mb-6 h-52 overflow-hidden sm:-mx-8">
        <MediaImage media={article.image} sizes="560px" />
      </div>
      <Eyebrow className="text-gold-dark">
        {article.category} · {article.readMinutes || 3} menit baca
      </Eyebrow>
      <h2 id="seri-dialog-title" className="mt-3 font-serif text-[33px] leading-tight">
        {article.title}
      </h2>
      <p className="mt-4 text-sm leading-[1.9] text-[#a08362]">{article.excerpt}</p>
      <div className="mt-5 space-y-4 border-t border-line pt-5">
        {article.body.split('\n\n').map((p, i) => (
          <p className="text-xs leading-[2] text-muted" key={i}>
            {p}
          </p>
        ))}
      </div>
      {article.sourceURL && (
        <a
          href={article.sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 text-[11px] text-gold-dark"
        >
          Baca sumber edukasi
          <Icon name="diagonal" size={14} />
        </a>
      )}
      <div className="mt-6 border-t border-line pt-4 text-[9px] leading-relaxed text-muted">
        <p>
          Ditulis untuk edukasi umum oleh SERI. Bukan diagnosis atau pengganti konsultasi dokter.
        </p>
        {article.photoCredit && <p className="mt-2">Foto: {article.photoCredit} / Unsplash</p>}
      </div>
    </>
  )
}
function CreatorDialog({ creator: c }: { creator: Creator }) {
  return (
    <>
      <Intro icon="book" title={c.name} sub={c.expertise} />
      <p className="text-sm leading-[1.9] text-muted">{c.description}</p>
      <div className="mt-5 rounded-2xl border border-white bg-[#eee4d1]/50 p-4 text-[11px] leading-relaxed text-[#a1845d]">
        Kanal pilihan untuk belajar tentang bahan aktif, rutinitas, dan kesehatan kulit. Pilihan
        editorial SERI tidak berarti kreator ini bekerja sama atau mendukung SERI.
      </div>
      <h3 className="mt-6 font-serif text-2xl">Mulai dari rasa ingin tahu.</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Cari konten tentang skin barrier, sunscreen, atau rutinitas dasar di kanalnya. Jangan
        menganggap konten publik sebagai konsultasi pribadi.
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={c.channel}
        className={`${primaryButton} mt-6 w-full`}
      >
        Jelajahi kanal {c.platform}
        <Icon name="diagonal" size={16} />
      </a>
    </>
  )
}
function ProfileDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const [error, setError] = useState('')
  const user = account.user
  if (!user) return <SignInPrompt />
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const result = await mutate({
      operation: 'profile',
      name: form.get('name'),
      phone: form.get('phone'),
    })
    if (!result.ok) return setError(result.error!)
    notify('Profilmu sudah diperbarui.')
    open(null)
  }
  return (
    <>
      <Intro
        title="Hal kecil tentang dirimu."
        sub="Ini ruangmu. Perbarui informasi yang ingin kamu bagikan."
        icon="user"
      />
      <form onSubmit={submit}>
        <Field label="Nama akun">
          <input
            name="name"
            defaultValue={user.name}
            required
            minLength={2}
            maxLength={60}
            className={inputClass}
          />
        </Field>
        <Field label="Email" hint="Email login tidak bisa diganti lewat profil demi keamanan akun.">
          <input type="email" readOnly value={user.email} className={`${inputClass} text-muted`} />
        </Field>
        <Field label="Nomor telepon" hint="Opsional. Tidak ditampilkan ke anggota lain.">
          <input
            name="phone"
            type="tel"
            defaultValue={user.phone || ''}
            maxLength={24}
            className={inputClass}
            placeholder="+62..."
          />
        </Field>
        <ErrorText text={error} />
        <button disabled={busy} className={`${primaryButton} mt-2 w-full`}>
          {busy ? 'Menyimpan...' : 'Simpan profil'}
          <Icon name="check" size={16} />
        </button>
      </form>
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <strong className="block text-xs font-medium">Akun Google</strong>
            <span className="mt-1.5 block text-[10px] text-muted">Belum terhubung</span>
          </div>
          <button
            className={`${lightButton} !text-[11px]`}
            onClick={() => open({ type: 'google' })}
          >
            Hubungkan Google
            <Icon name="diagonal" size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
function SkinDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const [type, setType] = useState(account.user?.skinProfile?.skinType || '')
  const [concerns, setConcerns] = useState<string[]>(account.user?.skinProfile?.concerns || [])
  const [error, setError] = useState('')
  if (!account.user) return <SignInPrompt />
  async function save() {
    if (!type || type === 'Belum diisi') return setError('Pilih jenis kulitmu terlebih dahulu.')
    const result = await mutate({ operation: 'profile', skinType: type, concerns })
    if (!result.ok) return setError(result.error!)
    open(null)
    notify('Profil kulitmu tersimpan. Kita kenalan pelan-pelan.')
  }
  return (
    <>
      <Intro
        title="Mulai dari mengenal kulitmu."
        sub="Profil awal berdasarkan jawabanmu, bukan analisis medis atau diagnosis AI."
      />
      <Eyebrow className="text-gold-dark">MENURUTMU, JENIS KULITMU...</Eyebrow>
      <div className="mb-6 mt-3 flex flex-wrap gap-2">
        {['Normal', 'Kering', 'Berminyak', 'Kombinasi', 'Sensitif'].map((v) => (
          <button
            key={v}
            onClick={() => setType(v)}
            aria-pressed={type === v}
            className={`min-h-11 rounded-2xl border px-4 text-xs ${type === v ? 'border-gold bg-[#eadbb9] text-[#8d713e]' : 'border-white bg-white/65 text-muted'}`}
          >
            {v}
          </button>
        ))}
      </div>
      <Eyebrow className="text-gold-dark">YANG INGIN KAMU PERHATIKAN</Eyebrow>
      <p className="mt-2 text-[10px] text-muted">Boleh pilih lebih dari satu, atau belum ada.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Jerawat', 'Kemerahan', 'Kulit kering', 'Tekstur', 'Bekas jerawat', 'Kusam'].map((v) => (
          <button
            key={v}
            onClick={() =>
              setConcerns((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]))
            }
            aria-pressed={concerns.includes(v)}
            className={`flex min-h-11 items-center gap-2 rounded-2xl border px-4 text-xs ${concerns.includes(v) ? 'border-gold bg-[#eadbb9] text-[#8d713e]' : 'border-white bg-white/65 text-muted'}`}
          >
            {concerns.includes(v) && <Icon name="check" size={13} />} {v}
          </button>
        ))}
      </div>
      <ErrorText text={error} />
      <button
        disabled={busy}
        onClick={() => void save()}
        className={`${primaryButton} mt-7 w-full`}
      >
        {busy ? 'Menyimpan...' : 'Simpan profil kulitku'}
        <Icon name="arrow" size={17} />
      </button>
    </>
  )
}
function PreferencesDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const p = account.user?.preferences
  const [values, setValues] = useState({
    notifications: !!p?.notifications,
    morningEnabled: p?.morningEnabled ?? true,
    morningTime: p?.morningTime || '06:30',
    eveningEnabled: p?.eveningEnabled ?? true,
    eveningTime: p?.eveningTime || '20:00',
    weeklyEnabled: p?.weeklyEnabled ?? true,
    weeklyDay: p?.weeklyDay || 'Minggu',
  })
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  if (!account.user) return <SignInPrompt />
  function toggle(k: 'notifications' | 'morningEnabled' | 'eveningEnabled' | 'weeklyEnabled') {
    setValues((v) => ({ ...v, [k]: !v[k] }))
  }
  async function enable() {
    if (values.notifications) {
      toggle('notifications')
      return
    }
    if (!('Notification' in window)) {
      setNote(
        'Browser ini belum mendukung notifikasi. Pengingat di aplikasi tetap bisa ditampilkan saat halaman terbuka.',
      )
      toggle('notifications')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setValues((v) => ({ ...v, notifications: true }))
      setNote('Izin diberikan. Pengingat hanya dikirim ketika SERI terbuka di browser.')
    } else setNote('Izin belum diberikan. Kamu bisa mengubahnya di pengaturan browser.')
  }
  async function save() {
    const result = await mutate({ operation: 'profile', preferences: values })
    if (!result.ok) return setError(result.error!)
    open(null)
    notify('Pengingat lembutmu sudah disimpan.')
  }
  function switchButton(
    k: 'notifications' | 'morningEnabled' | 'eveningEnabled' | 'weeklyEnabled',
    label: string,
  ) {
    return (
      <button
        role="switch"
        aria-checked={values[k]}
        aria-label={label}
        onClick={() => (k === 'notifications' ? void enable() : toggle(k))}
        className={`h-6 w-10 shrink-0 rounded-full p-[3px] transition ${values[k] ? 'bg-[#b59a63]' : 'bg-[#ded4c5]'}`}
      >
        <span
          className={`block size-[18px] rounded-full bg-white shadow-sm transition-transform ${values[k] ? 'translate-x-4' : ''}`}
        />
      </button>
    )
  }
  return (
    <>
      <Intro
        title="Pengingat yang terasa hangat."
        sub="Atur waktu untuk merawat diri, tanpa membebani harimu."
        icon="bell"
      />
      <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/50 p-4">
        <div>
          <h3 className="text-xs font-medium">Izinkan pemberitahuan</h3>
          <p className="mt-1 text-[10px] text-muted">Pengingat saat SERI terbuka</p>
        </div>
        {switchButton('notifications', 'Izinkan pemberitahuan')}
      </div>
      <div className="space-y-5">
        {[
          {
            key: 'morningEnabled' as const,
            timeKey: 'morningTime' as const,
            name: 'Rutinitas pagi',
            icon: 'sun',
          },
          {
            key: 'eveningEnabled' as const,
            timeKey: 'eveningTime' as const,
            name: 'Rutinitas malam',
            icon: 'moon',
          },
        ].map((r) => (
          <div className="flex items-center gap-3" key={r.name}>
            <IconBox name={r.icon} />
            <div className="flex-1">
              <span className="mb-2 block text-xs font-medium">{r.name}</span>
              <input
                aria-label={`Jam ${r.name.toLowerCase()}`}
                type="time"
                min="00:00"
                max="21:30"
                value={values[r.timeKey]}
                onChange={(e) => setValues((v) => ({ ...v, [r.timeKey]: e.target.value }))}
                className="rounded-lg border border-[#ded1be] bg-white/65 px-3 py-1.5 text-xs text-[#94794d]"
              />
            </div>
            {switchButton(r.key, r.name)}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <IconBox name="calendar" />
          <div className="flex-1">
            <label htmlFor="weekly-day" className="mb-2 block text-xs font-medium">
              Evaluasi mingguan
            </label>
            <select
              id="weekly-day"
              value={values.weeklyDay}
              onChange={(e) =>
                setValues((v) => ({ ...v, weeklyDay: e.target.value as typeof v.weeklyDay }))
              }
              className="rounded-lg border border-[#ded1be] bg-white/65 px-3 py-1.5 text-xs text-[#94794d]"
            >
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          {switchButton('weeklyEnabled', 'Evaluasi mingguan')}
        </div>
      </div>
      {note && (
        <p role="status" className="mt-5 text-[11px] leading-relaxed text-gold-dark">
          {note}
        </p>
      )}
      <div className="mt-6 rounded-2xl bg-[#eee5d6]/60 p-4 text-[10px] leading-relaxed text-[#a18a6a]">
        Tidak ada pengingat setelah pukul 21.30. Notifikasi terjadwal di luar aplikasi belum aktif;
        pengingat hanya muncul saat SERI terbuka, sesuai izin browser.
      </div>
      <ErrorText text={error} />
      <button
        disabled={busy}
        onClick={() => void save()}
        className={`${primaryButton} mt-6 w-full`}
      >
        {busy ? 'Menyimpan...' : 'Simpan pengingat'}
        <Icon name="check" size={16} />
      </button>
    </>
  )
}
function PrivacyDialog() {
  const { account, open } = useAccount()
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(account, null, 2)], { type: 'application/json' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = 'perjalanan-seri.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <>
      <Intro
        title="Ceritamu, kendalimu."
        sub="Transparansi kecil untuk kepercayaan yang besar."
        icon="shield"
      />
      <div className="space-y-4 text-xs leading-[1.9] text-muted">
        <p>
          Nama, email, profil kulit, preferensi, check-in, dan rutinitas disimpan di backend SERI
          dan dibatasi ke akun pemiliknya. Foto profil yang kamu pilih untuk diunggah bersifat
          publik melalui URL; jangan unggah foto medis atau sensitif.
        </p>
        <p>
          SERI belum menghubungkan data ke penyedia AI atau layanan iklan. Percakapan panduan tidak
          disimpan. Tautan toko dan kanal kreator membawa kamu ke situs pihak ketiga dengan
          kebijakan mereka sendiri.
        </p>
        <p>
          Ekspor di bawah berisi hingga 100 check-in dan 100 rutinitas terbaru yang dimuat aplikasi.
          Penghapusan akun menghapus seluruh catatan terkait akun, bukan hanya yang tampil di layar.
        </p>
      </div>
      <button
        onClick={() => (account.user ? exportData() : open({ type: 'auth' }))}
        className={`${lightButton} mt-6 w-full`}
      >
        Unduh data yang dimuat
        <Icon name="arrow" size={16} />
      </button>
      <button
        onClick={() => open({ type: 'delete' })}
        className="mt-4 min-h-11 w-full text-xs text-[#a76f54]"
      >
        Kelola penghapusan akun
      </button>
    </>
  )
}
function HelpDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const [error, setError] = useState('')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!account.user) return open({ type: 'auth' })
    const f = new FormData(e.currentTarget)
    const result = await mutate({
      operation: 'feedback',
      category: f.get('category'),
      message: f.get('message'),
    })
    if (!result.ok) return setError(result.error!)
    notify('Pesanmu tersimpan untuk tim SERI. Terima kasih sudah bercerita.')
    open(null)
  }
  return (
    <>
      <Intro
        title="Ada yang bisa kami bantu?"
        sub="Punya pertanyaan tentang aplikasi, atau ide agar SERI terasa lebih baik? Kami ingin mendengarnya."
        icon="help"
      />
      <form onSubmit={submit}>
        <Field label="Tentang apa?">
          <select name="category" className={inputClass}>
            <option value="bantuan">Bantuan aplikasi</option>
            <option value="feedback">Ide & masukan</option>
          </select>
        </Field>
        <Field label="Ceritakan di sini">
          <textarea
            name="message"
            required
            minLength={5}
            maxLength={2000}
            className={`${inputClass} min-h-32 resize-y`}
            placeholder="Yang ingin aku ceritakan..."
          />
        </Field>
        <ErrorText text={error} />
        <button disabled={busy} className={`${primaryButton} w-full`}>
          {busy ? 'Mengirim...' : 'Kirim ke tim SERI'}
          <Icon name="send" size={16} />
        </button>
      </form>
      <p className="mt-5 text-[10px] leading-relaxed text-muted">
        Pesan ini bukan kanal darurat medis. Untuk keluhan kesehatan, hubungi dokter atau fasilitas
        kesehatan terdekat. Balasan langsung belum tersedia.
      </p>
    </>
  )
}
function ProDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const [error, setError] = useState('')
  async function interest() {
    if (!account.user) return open({ type: 'auth' })
    const result = await mutate({
      operation: 'feedback',
      category: 'pro',
      message: 'Saya tertarik mendapatkan informasi peluncuran SERI Pro.',
    })
    if (!result.ok) return setError(result.error!)
    notify('Minatmu untuk SERI Pro sudah tercatat. Tidak ada biaya yang ditagihkan.')
    open(null)
  }
  return (
    <div className="text-cream">
      <span className="mt-1 inline-flex items-center gap-2 rounded-full border border-[#cbb071]/35 px-3 py-2 text-[9px] font-medium tracking-[.16em] text-gold-light">
        <Icon name="star" size={13} />
        SERI PRO · COMING SOON
      </span>
      <div className="mx-auto my-9 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-[#efdaa3] to-[#b18d4a] text-[#4f331b] shadow-[0_0_60px_#e3b86020]">
        <Icon name="star" size={39} />
      </div>
      <h2 id="seri-dialog-title" className="font-serif text-[39px] leading-tight">
        A little more care.
        <br />
        <span className="text-[#d4b77a]">All for you.</span>
      </h2>
      <p className="mt-5 text-xs leading-[1.9] text-[#bea58b]">
        Kami sedang merancang pendampingan yang lebih personal untuk perjalanan kulitmu. Ini rencana
        fitur, bukan layanan aktif.
      </p>
      <ul className="my-7 space-y-4">
        {[
          'Ringkasan perjalanan kulit yang lebih mendalam',
          'Panduan edukasi sesuai perhatian kulitmu',
          'Lebih banyak ruang untuk refleksi dan rutinitas',
        ].map((t) => (
          <li className="flex items-start gap-3 text-xs leading-relaxed text-[#d9c9b0]" key={t}>
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#c9ac6d] text-[#49301d]">
              <Icon name="check" size={11} />
            </span>
            {t}
          </li>
        ))}
      </ul>
      <p className="rounded-xl border border-[#b39459]/25 bg-white/5 p-4 text-[10px] leading-relaxed text-[#b79b73]">
        Harga dan jadwal peluncuran belum ditetapkan. Tidak ada pembayaran, uji coba berbayar, atau
        perubahan status akun saat ini.
      </p>
      <ErrorText text={error} />
      <button
        disabled={busy}
        onClick={() => void interest()}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#eedba8] to-[#b99c5d] px-5 text-xs font-semibold text-[#4e321d]"
      >
        {busy ? 'Mencatat...' : 'Aku tertarik dengan SERI Pro'}
        <Icon name="arrow" size={16} />
      </button>
    </div>
  )
}
function DeleteDialog() {
  const { account, mutate, busy, open, notify } = useAccount()
  const [error, setError] = useState('')
  if (!account.user) return <SignInPrompt />
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const result = await mutate({
      operation: 'delete',
      confirmation: f.get('confirmation'),
      password: f.get('password'),
    })
    if (!result.ok) return setError(result.error!)
    open(null)
    notify('Akun dan catatan pribadimu sudah dihapus. Jaga dirimu, ya.')
  }
  return (
    <>
      <Intro
        title="Mau meninggalkan ruang ini?"
        sub="Kamu berhak memilih. Pastikan ini memang yang kamu inginkan."
        icon="trash"
      />
      <div className="mb-5 rounded-2xl border border-[#e4c9ae] bg-[#f6e8d7]/60 p-4 text-xs leading-[1.9] text-[#9f7654]">
        Akun, semua check-in, rutinitas, feedback, dan foto profil yang terhubung akan dihapus
        permanen. Data yang sudah dihapus tidak dapat dipulihkan.
      </div>
      <form onSubmit={submit}>
        <Field label="Ketik HAPUS untuk mengonfirmasi">
          <input
            name="confirmation"
            required
            pattern="HAPUS"
            autoComplete="off"
            className={inputClass}
          />
        </Field>
        <Field label="Kata sandi akunmu">
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </Field>
        <ErrorText text={error} />
        <button
          disabled={busy}
          className="mt-4 min-h-12 w-full rounded-full bg-[#9e654b] text-xs font-medium text-white disabled:opacity-40"
        >
          {busy ? 'Menghapus...' : 'Hapus akun & semua dataku'}
        </button>
        <button type="button" onClick={() => open(null)} className={`${lightButton} mt-3 w-full`}>
          Aku ingin tetap di sini
        </button>
      </form>
    </>
  )
}
function SignoutDialog() {
  const { mutate, busy, open, notify } = useAccount()
  const [error, setError] = useState('')
  async function logout() {
    const result = await mutate({ operation: 'logout' }, '/api/seri/auth')
    if (!result.ok) return setError(result.error!)
    open(null)
    notify('Kamu sudah keluar dengan aman.')
  }
  return (
    <>
      <Intro
        title="Sampai jumpa sebentar lagi."
        sub="Catatanmu tetap tersimpan aman di akun. Kamu bisa melanjutkan perjalanan kapan saja."
        icon="logout"
      />
      <ErrorText text={error} />
      <button onClick={() => void logout()} disabled={busy} className={`${primaryButton} w-full`}>
        {busy ? 'Sebentar...' : 'Sign out'}
        <Icon name="logout" size={17} />
      </button>
    </>
  )
}
function AvatarDialog() {
  const { account, open, refresh, notify } = useAccount()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  if (!account.user) return <SignInPrompt />
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return setError('Pilih fotomu terlebih dahulu.')
    setBusy(true)
    try {
      const form = new FormData(e.currentTarget)
      form.set('photo', file)
      form.set('consent', form.get('consent') === 'on' ? 'true' : 'false')
      const res = await fetch('/api/seri/avatar', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await refresh()
      open(null)
      notify('Foto profilmu sudah diperbarui.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Foto belum dapat disimpan.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <Intro
        title="Wajah dari ceritamu."
        sub="Pilih foto profil JPG, PNG, atau WebP, maksimal 2 MB."
        icon="camera"
      />
      <form onSubmit={submit}>
        {preview && (
          <div className="relative mx-auto mb-5 size-32 overflow-hidden rounded-full border-4 border-white">
            <Image
              src={preview}
              alt="Pratinjau foto profil"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
        <Field label="Pilih foto">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={`${inputClass} !text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[#eee2ca] file:px-3 file:py-2 file:text-xs file:text-[#8d713e]`}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Field>
        <label className="flex items-start gap-3 text-[10px] leading-relaxed text-muted">
          <input name="consent" required type="checkbox" className="mt-1 accent-[#aa8c51]" />
          <span>
            Saya memahami foto profil tersedia melalui URL publik. Saya tidak mengunggah foto
            kondisi medis atau informasi sensitif.
          </span>
        </label>
        <ErrorText text={error} />
        <button className={`${primaryButton} mt-6 w-full`} disabled={busy}>
          {busy ? 'Mengunggah...' : 'Simpan foto profil'}
          <Icon name="check" size={17} />
        </button>
      </form>
    </>
  )
}
function GoogleDialog() {
  const { open } = useAccount()
  return (
    <>
      <Intro
        title="Hubungkan akun Google."
        sub="Koneksi Google belum dikonfigurasi untuk aplikasi ini."
        icon="lock"
      />
      <p className="text-xs leading-[1.9] text-muted">
        Akun SERI-mu saat ini menggunakan email dan kata sandi. Login Google memerlukan konfigurasi
        OAuth dan persetujuan melalui Google; menekan tombol tidak akan membuat akunmu terhubung
        secara otomatis.
      </p>
      <p className="mt-4 text-xs leading-[1.9] text-muted">
        Kamu tetap bisa menggunakan seluruh pencatatan, profil, dan preferensi dengan akun email.
        Tidak ada data yang dikirim ke Google dari layar ini.
      </p>
      <button onClick={() => open({ type: 'profile' })} className={`${primaryButton} mt-6 w-full`}>
        Kembali ke informasi akun
        <Icon name="back" size={16} />
      </button>
    </>
  )
}
function SafetyDialog() {
  const { open } = useAccount()
  return (
    <>
      <Intro
        title="Utamakan keselamatanmu."
        sub="Terima kasih sudah memperhatikan apa yang tubuhmu rasakan."
        icon="shield"
      />
      <div className="space-y-4 text-xs leading-[1.9] text-muted">
        <p>
          Jika mengalami sesak napas, bengkak hebat, atau reaksi yang memburuk dengan cepat, segera
          cari bantuan medis darurat di fasilitas kesehatan terdekat. Jangan menunggu evaluasi
          aplikasi.
        </p>
        <p>
          Untuk keluhan berat atau menetap, periksakan ke Puskesmas, dokter umum, atau dokter
          spesialis kulit. Jangan menambah produk baru dan konsultasikan obat resep dengan dokter
          yang merawatmu.
        </p>
        <p>Check-in telah dicatat untuk membantumu mengingat keluhan, bukan sebagai diagnosis.</p>
      </div>
      <button onClick={() => open(null)} className={`${primaryButton} mt-6 w-full`}>
        Saya mengerti
        <Icon name="check" size={16} />
      </button>
    </>
  )
}
function AboutDialog() {
  return (
    <>
      <Intro
        title="Lebih dekat dengan kulitmu. Lebih baik pada dirimu."
        sub="SERI — teman bertumbuh bersama kulitmu."
        icon="heart"
      />
      <div className="space-y-4 text-xs leading-[1.9] text-muted">
        <p>
          SERI membantumu membangun rutinitas sederhana, mencatat kondisi kulit, dan menemukan
          edukasi tanpa tekanan untuk menjadi sempurna.
        </p>
        <p>
          SERI bukan dokter dan tidak memberikan diagnosis, jaminan kesembuhan, atau resep personal.
          Profil kulit berdasarkan jawabanmu; skor dari check-in menggambarkan keluhan yang kamu
          laporkan.
        </p>
        <p>
          Mode percakapan saat ini adalah panduan berbasis artikel terkurasi, bukan layanan AI
          generatif. Koneksi Google, pembayaran Pro, harga toko real-time, dan tautan affiliate
          terverifikasi belum aktif.
        </p>
      </div>
      <p className="mt-6 border-t border-line pt-4 text-[9px] leading-relaxed text-[#af9a83]">
        Foto: Laura Jaeger, ian dooley, Aleksandrs Karevs / Unsplash.
        <br />
        SERI · Made with a little care.
      </p>
    </>
  )
}
function SignInPrompt() {
  const { open } = useAccount()
  return (
    <>
      <Intro
        title="Ruang ini milikmu."
        sub="Masuk untuk menyimpan profil dan catatan kulit dengan aman."
        icon="lock"
      />
      <button onClick={() => open({ type: 'auth' })} className={`${primaryButton} w-full`}>
        Masuk / buat akun
        <Icon name="arrow" size={17} />
      </button>
    </>
  )
}
