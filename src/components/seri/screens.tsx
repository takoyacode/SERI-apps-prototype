'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SeriContent } from '@/lib/seri-content'
import { localDay, moods, programDay, type ScreenName } from '@/lib/seri-types'
import { useAccount } from './account-provider'
import { Icon } from './icon'
import {
  ArticleCard,
  Avatar,
  CreatorCard,
  EmptyState,
  Eyebrow,
  Heading,
  IconBox,
  MediaImage,
  ProductIllustration,
  SectionHeading,
  glass,
  inputClass,
  lightButton,
  primaryButton,
} from './ui'

export function SeriScreen({ screen, content }: { screen: ScreenName; content: SeriContent }) {
  const [liveContent, setLiveContent] = useState(content)
  useEffect(() => {
    setLiveContent(content)
    const controller = new AbortController()
    fetch('/api/seri/content', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return
        setLiveContent(await response.json())
      })
      .catch((error) => {
        if (error.name !== 'AbortError')
          console.warn('SERI: menampilkan konten terakhir saat koneksi belum tersedia.')
      })
    return () => controller.abort()
  }, [content])
  if (screen === 'Rutinitas') return <RoutineScreen content={liveContent} />
  if (screen === 'Explore') return <ExploreScreen content={liveContent} />
  if (screen === 'Profil Kamu') return <ProfileScreen />
  if (screen === 'Check-in') return <CheckinScreen />
  if (screen === 'Progres') return <ProgressScreen />
  if (screen === 'Tanya SERI') return <ChatScreen content={liveContent} />
  return <HomeScreen content={liveContent} />
}
function HomeScreen({ content }: { content: SeriContent }) {
  const { account, open } = useAccount()
  const user = account.user
  const day = programDay(user)
  const today = account.checkins.find((c) => c.day === localDay())
  const todayRoutine = account.routines.find((c) => c.day === localDay())
  const [slide, setSlide] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const articles = content.articles.slice(0, 4)
  const latest = account.checkins[0]
  return (
    <>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Eyebrow className="text-gold-dark">A LITTLE CARE, EVERY DAY</Eyebrow>
          <h1 className="mt-2 font-serif text-[32px] leading-tight tracking-[-1px] md:text-[38px]">
            Selamat datang,{' '}
            <span className="italic text-[#9a7555]">{user?.name.split(' ')[0] || 'teman'}.</span>
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted md:text-[13px]">
            Pelan-pelan, kulitmu sedang bertumbuh. Kamu juga.
          </p>
        </div>
        <span className="mb-1 hidden items-center gap-2 text-[10px] text-[#9f8a75] md:flex">
          <Icon name="calendar" size={16} />
          <span suppressHydrationWarning>
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'Asia/Jakarta',
            })}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <div className="min-w-0">
          <section className="relative flex min-h-[325px] overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-[#e6c5b1] via-[#dec1ac] to-[#baa08c] shadow-[0_8px_30px_#79563c08] sm:min-h-[335px]">
            <div className="relative z-10 flex w-[65%] flex-col items-start px-5 py-7 sm:w-[60%] sm:px-8 sm:py-8">
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/30 px-3 py-1.5 text-[8px] font-semibold tracking-[.15em] text-[#70513c] backdrop-blur-md">
                <Icon name="leaf" size={12} />
                YOUR SKIN, UNDERSTOOD
              </span>
              <h2 className="whitespace-pre-line font-serif text-[27px] leading-[1.12] tracking-[-1.1px] text-[#49301f] sm:text-[38px]">
                {content.settings.heroTitle || 'Kulitmu punya cerita.\nKita rawat bersama.'}
              </h2>
              <p className="mt-4 max-w-[240px] text-[11px] leading-[1.85] text-[#886954] sm:text-xs">
                {content.settings.heroDescription}
              </p>
              <Link
                href="/rutinitas"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-4 rounded-full bg-[#fff8ee]/85 px-5 py-3 text-[11px] font-medium text-[#62442e] shadow-sm backdrop-blur-md transition hover:bg-white"
              >
                Kenali rutinitasku
                <Icon name="arrow" size={16} />
              </Link>
              <span className="mt-5 flex items-center gap-1.5 text-[8px] text-[#987660]">
                <Icon name="heart" size={11} />
                Good things take a little time.
              </span>
            </div>
            <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden rounded-tl-[100px]">
              <MediaImage
                media={content.settings.heroImage}
                className="object-[45%_center]"
                sizes="(max-width: 768px) 50vw, 400px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#dec1ac]/15 to-transparent" />
              <span className="absolute bottom-5 right-4 flex items-center gap-1 rounded-full border border-white/50 bg-white/20 px-3 py-1.5 text-[7px] tracking-[.12em] text-white backdrop-blur-xl">
                <Icon name="spark" size={11} />
                LET YOUR SKIN BREATHE
              </span>
            </div>
          </section>
          <div className={`${glass} mt-4 flex items-center gap-3 p-4 xl:hidden`}>
            <IconBox name="calendar" />
            <div className="min-w-0 flex-1">
              <Eyebrow className="text-[8px] text-gold-dark">PROGRAM KULITMU</Eyebrow>
              <p className="mt-1 font-serif text-lg">
                {user ? `Hari ke-${day}, bersama SERI.` : 'Perjalanan barumu dimulai di sini.'}
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-muted">
                {user
                  ? 'Tidak terburu-buru. Kita ikuti kondisi kulitmu.'
                  : 'Masuk untuk menyimpan hari-hari kecilmu.'}
              </p>
            </div>
            {user ? (
              <Link
                href="/progres"
                aria-label="Lihat hari program dan progres"
                className="p-2 text-gold-dark"
              >
                <Icon name="diagonal" size={17} />
              </Link>
            ) : (
              <button
                aria-label="Mulai program kulitku"
                onClick={() => open({ type: 'auth' })}
                className="p-2 text-gold-dark"
              >
                <Icon name="arrow" size={17} />
              </button>
            )}
          </div>
          <section
            className="mb-7 mt-5 grid grid-cols-3 gap-2.5 md:gap-3.5"
            aria-label="Akses cepat perawatanku"
          >
            {[
              {
                title: 'Cek progres',
                subtitle: 'Lihat perjalananmu',
                icon: 'chart',
                href: '/progres',
              },
              {
                title: 'Daily check-in',
                subtitle: today ? 'Sudah check-in hari ini' : 'Dengarkan kulitmu',
                icon: 'checkin',
                href: '/check-in',
              },
              { title: 'Tanya SERI AI', subtitle: 'Teman ceritamu', icon: 'spark', href: '/tanya' },
            ].map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className={`${glass} group relative p-3.5 transition hover:-translate-y-1 hover:bg-white/90 sm:p-5`}
              >
                <div className="mb-4 flex items-center justify-between text-[#aa8a5d]">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#ede5d7]/70">
                    <Icon name={t.icon} size={19} />
                  </span>
                  <Icon name="diagonal" size={14} className="hidden text-[#ac9985] sm:block" />
                </div>
                <strong className="block text-[10px] font-semibold sm:text-xs">{t.title}</strong>
                <span className="mt-1.5 block text-[8px] leading-relaxed text-muted sm:text-[10px]">
                  {t.subtitle}
                </span>
              </Link>
            ))}
          </section>
          <SectionHeading
            title="Sedikit perawatan, setiap hari"
            href="/rutinitas"
            action="Rutinitasku"
          />
          <section className={`${glass} divide-y divide-[#d9cbbb]/30 px-5`}>
            {[
              {
                name: 'Rutinitas pagi',
                icon: 'sun',
                done: todayRoutine?.morning,
                time: user?.preferences?.morningTime || '06:30',
              },
              {
                name: 'Rutinitas malam',
                icon: 'moon',
                done: todayRoutine?.evening,
                time: user?.preferences?.eveningTime || '20:00',
              },
            ].map((r) => (
              <Link href="/rutinitas" key={r.name} className="flex items-center gap-3.5 py-4">
                <IconBox name={r.icon} />
                <span>
                  <strong className="block text-xs font-medium">{r.name}</strong>
                  <span className="mt-1.5 block text-[10px] text-muted">
                    Rawat dengan lembut · {r.time}
                  </span>
                </span>
                <span
                  className={`ml-auto rounded-full px-2.5 py-1.5 text-[8px] ${r.done ? 'bg-[#e9efe4] text-[#7f8a66]' : 'bg-[#f2ece3] text-[#a08a71]'}`}
                >
                  {r.done ? 'Selesai' : 'Mulai merawat'}
                </span>
                <Icon
                  name={r.done ? 'check' : 'chevron'}
                  size={15}
                  className={r.done ? 'text-[#7f8a66]' : 'text-[#b6a58e]'}
                />
              </Link>
            ))}
          </section>
          <section className="mt-7">
            <SectionHeading title="Cerita baik untuk kulitmu" href="/explore" action="Explore" />
            {articles.length ? (
              <>
                <div
                  ref={scrollRef}
                  onScroll={() => {
                    const el = scrollRef.current
                    if (el)
                      setSlide(
                        Math.round(
                          el.scrollLeft / ((el.firstElementChild?.clientWidth || 250) + 16),
                        ),
                      )
                  }}
                  className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]"
                >
                  {articles.map((a) => (
                    <div key={a.id} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-8px)]">
                      <ArticleCard article={a} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {articles.map((a, i) => (
                      <button
                        aria-label={`Lihat slide ${i + 1}`}
                        key={a.id}
                        onClick={() =>
                          scrollRef.current?.scrollTo({
                            left:
                              i * ((scrollRef.current.firstElementChild?.clientWidth || 250) + 16),
                            behavior: 'smooth',
                          })
                        }
                        className="flex size-6 items-center justify-center"
                      >
                        <span
                          className={`h-1.5 rounded-full transition-all ${slide === i ? 'w-4 bg-gold' : 'w-1.5 bg-[#dbd0c1]'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {[-1, 1].map((d) => (
                      <button
                        key={d}
                        aria-label={d === 1 ? 'Slide berikutnya' : 'Slide sebelumnya'}
                        className="flex size-8 items-center justify-center rounded-full border border-white bg-white/40 text-[#9f8769]"
                        onClick={() =>
                          scrollRef.current?.scrollBy({
                            left:
                              d * ((scrollRef.current.firstElementChild?.clientWidth || 250) + 16),
                            behavior: 'smooth',
                          })
                        }
                      >
                        <Icon name={d === 1 ? 'arrow' : 'back'} size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                title="Cerita sedang disiapkan"
                text="Artikel edukasi akan tampil di sini setelah diterbitkan."
              />
            )}
          </section>
        </div>
        <aside className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <section className={`${glass} hidden items-center gap-4 p-5 xl:col-span-1 xl:flex`}>
            <div className="relative flex size-[73px] shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 80 80"
                className="absolute inset-0 size-full -rotate-90"
                aria-hidden="true"
              >
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e9e0d4" strokeWidth="4" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#bba16d"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${user ? Math.min(1, account.checkinCount / Math.max(1, day)) * 214 : 0} 214`}
                />
              </svg>
              <span className="text-center">
                <strong className="block font-serif text-2xl leading-none">
                  {user ? day : '—'}
                </strong>
                <span className="mt-1 block text-[8px] tracking-widest text-gold-dark">HARI</span>
              </span>
            </div>
            <div>
              <Eyebrow className="text-[8px] text-gold-dark">
                {user ? 'PROGRAM KULITMU' : 'PERJALANAN BARUMU'}
              </Eyebrow>
              <h3 className="mt-2 font-serif text-[21px]">
                {user ? `Hari ke-${day}, bersama SERI.` : 'Mulai dari dirimu.'}
              </h3>
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                {user
                  ? 'Kondisi kulit, bukan kalender, yang jadi panduan.'
                  : 'Masuk untuk menyimpan setiap langkah kecilmu.'}
              </p>
              {!user && (
                <button
                  onClick={() => open({ type: 'auth' })}
                  className="mt-2 flex items-center gap-2 text-[10px] font-medium text-gold-dark"
                >
                  Mulai perjalanan
                  <Icon name="arrow" size={12} />
                </button>
              )}
            </div>
          </section>
          <section className="relative overflow-hidden rounded-[26px] border border-[#fff4d1]/20 bg-gradient-to-br from-[#5f3f2b] via-[#3b2519] to-[#2a1a11] p-6 text-cream shadow-[0_12px_30px_#50352212]">
            <div className="pointer-events-none absolute -right-16 -top-10 size-56 rounded-full bg-[#e5b678]/10 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-full border border-[#ead4a6]/20 bg-white/5 text-[#ddc18b]">
                <Icon name="spark" size={19} />
              </span>
              <Eyebrow className="text-[8px] text-[#ceb68b]">A MOMENT FOR YOURSELF</Eyebrow>
            </div>
            <h2 className="relative mt-5 font-serif text-[30px] leading-tight tracking-[-.5px]">
              Apa kabar
              <br />
              kulitmu hari ini?
            </h2>
            <p className="mt-3 text-[11px] leading-[1.85] text-[#c1a997]">
              Satu menit untuk mendengarkan kulitmu.
              <br />
              Tidak ada jawaban benar atau salah.
            </p>
            <div className="my-5 flex items-center justify-between gap-1.5">
              {moods.map((m) => (
                <Link
                  key={m.value}
                  href="/check-in"
                  aria-label={`Check-in: ${m.label}`}
                  className="flex size-10 items-center justify-center rounded-full border border-[#e5cba3]/15 bg-white/5 text-[24px] transition hover:scale-110 hover:bg-white/15"
                >
                  {m.emoji}
                </Link>
              ))}
            </div>
            <Link
              href="/check-in"
              className="flex min-h-12 items-center justify-between rounded-full bg-gradient-to-r from-[#efdcaa] to-[#c7ab72] px-5 py-3 text-xs font-semibold text-[#4c321f] transition hover:brightness-110"
            >
              {today ? 'Lihat check-in hari ini' : 'Mulai daily check-in'}
              <Icon name="arrow" size={17} />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-[#ac9581]">
              <Icon name="lock" size={10} />
              Ruang aman, hanya untukmu.
            </p>
          </section>
          <section className={`${glass} p-5`}>
            <div className="flex items-start justify-between">
              <IconBox name="chart" />
              <Link
                href="/progres"
                aria-label="Lihat detail progres"
                className="p-2 text-[#aa8d64]"
              >
                <Icon name="diagonal" size={18} />
              </Link>
            </div>
            <p className="mt-4 text-[10px] text-muted">Satu langkah lebih dekat.</p>
            <h3 className="mt-1.5 font-serif text-[23px]">
              {latest ? 'Ada cerita di setiap langkah.' : 'Progres tidak harus sempurna.'}
            </h3>
            <div className="mt-4 flex items-baseline gap-2">
              <strong className="font-serif text-4xl text-[#896c46]">{latest?.score ?? '—'}</strong>
              <span className="text-xs text-[#b3a28e]">
                {latest ? '/ 12 · skor kondisi terakhir' : 'Catat check-in pertamamu'}
              </span>
            </div>
            <p className="mt-3 text-[9px] leading-relaxed text-muted">
              Makin rendah skornya, makin sedikit keluhan yang kamu catat. Bukan diagnosis.
            </p>
          </section>
          <section className="min-w-0 sm:col-span-2 xl:col-span-1">
            <SectionHeading title="Belajar dari ahlinya" href="/explore" action="Kenali" />
            <CreatorCarousel creators={content.creators} />
            {!content.creators.length && (
              <p className="text-xs text-muted">Kreator pilihan akan segera hadir.</p>
            )}
          </section>
        </aside>
      </div>
      <section className="mt-8 rounded-[25px] border border-white/70 bg-gradient-to-r from-[#eee4d3]/60 via-[#f8f2e8]/70 to-[#f0e0d7]/45 px-6 py-7 text-center">
        <span className="mb-3 inline-flex items-center gap-2 text-[#b39764]">
          <Icon name="leaf" size={18} />
          <Eyebrow className="text-[8px]">Pengingat lembut untukmu</Eyebrow>
        </span>
        <p className="mx-auto max-w-2xl font-serif text-[21px] leading-relaxed text-[#826a54] md:text-[24px]">
          “{content.settings.advice}”
        </p>
        <p className="mt-3 text-[9px] tracking-[.1em] text-[#b6a18b]">WITH A LITTLE LOVE, SERI.</p>
      </section>
    </>
  )
}
function CreatorCarousel({ creators }: { creators: SeriContent['creators'] }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  return (
    <div className="min-w-0">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none]"
        onScroll={() => {
          if (track.current)
            setIndex(
              Math.round(
                track.current.scrollLeft /
                  ((track.current.firstElementChild?.clientWidth || 250) + 12),
              ),
            )
        }}
      >
        {creators.map((c) => (
          <div key={c.id} className="w-full shrink-0 snap-start">
            <CreatorCard creator={c} />
            <p className="mt-3 line-clamp-3 px-1 text-[10px] leading-relaxed text-muted">
              {c.description}
            </p>
            <a
              href={c.channel}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-9 items-center gap-2 px-1 text-[10px] text-gold-dark"
            >
              Jelajahi konten di {c.platform}
              <Icon name="diagonal" size={12} />
            </a>
          </div>
        ))}
      </div>
      {creators.length > 1 && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {creators.map((c, i) => (
              <button
                key={c.id}
                aria-label={`Lihat kreator ${c.name}`}
                className="flex size-6 items-center justify-center"
                onClick={() =>
                  track.current?.scrollTo({
                    left: i * ((track.current.firstElementChild?.clientWidth || 250) + 12),
                    behavior: 'smooth',
                  })
                }
              >
                <span
                  className={`h-1.5 rounded-full ${index === i ? 'w-4 bg-gold' : 'w-1.5 bg-[#d9ccbb]'}`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {[-1, 1].map((d) => (
              <button
                key={d}
                aria-label={d > 0 ? 'Kreator berikutnya' : 'Kreator sebelumnya'}
                className="flex size-8 items-center justify-center rounded-full border border-white bg-white/50 text-gold-dark"
                onClick={() =>
                  track.current?.scrollBy({
                    left: d * ((track.current.firstElementChild?.clientWidth || 250) + 12),
                    behavior: 'smooth',
                  })
                }
              >
                <Icon name={d > 0 ? 'arrow' : 'back'} size={14} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
function RoutineScreen({ content }: { content: SeriContent }) {
  const { account, loading, open, mutate, busy, notify } = useAccount()
  const [period, setPeriod] = useState<'morning' | 'evening'>('morning')
  const products = content.products.filter((p) => p.period === 'both' || p.period === period)
  const done = account.routines.find((r) => r.day === localDay())?.[period] || false
  async function complete() {
    if (!account.user) return open({ type: 'auth' })
    const result = await mutate({ operation: 'routine', period, completed: !done })
    notify(
      result.ok
        ? done
          ? 'Rutinitas kembali ditandai belum selesai.'
          : 'Satu bentuk sayang untuk dirimu. Rutinitas tersimpan.'
        : result.error!,
    )
  }
  return (
    <div className="mx-auto max-w-[1080px]">
      <Heading
        eyebrow="YOUR EVERYDAY RITUAL"
        title="Sederhana, tapi penuh perhatian."
        subtitle="Rutinitas kecil yang membuatmu lebih dekat dengan kulitmu sendiri."
      />
      <div className="mb-7 grid gap-5 md:grid-cols-[1.6fr_1fr]">
        <section className={`${glass} p-6`}>
          <Eyebrow className="text-gold-dark">PROGRAM KULITMU</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl">
            {account.user
              ? `Fase ${account.user.phase === 'pemulihan' ? '2 · Pemulihan' : account.user.phase === 'penguatan' ? '3 · Penguatan' : '1 · Reset'}`
              : 'Perawatan yang dimulai dari kamu.'}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Kenali respons kulitmu sebelum menambahkan produk baru. Katalog di bawah adalah pilihan
            edukatif, bukan resep atau rekomendasi medis personal.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eee7d9] px-3 py-2 text-[10px] text-[#947d58]">
            <Icon name="shield" size={13} />
            Ikuti arahan dokter untuk obat dan kondisi khusus.
          </span>
        </section>
        <div className="rounded-[25px] border border-[#ead9c6] bg-gradient-to-br from-[#dfc3a8]/60 to-[#f2e5cf]/55 p-6">
          <Icon name="leaf" size={28} className="text-[#a28a58]" />
          <h3 className="mt-3 font-serif text-[24px]">Less, but better.</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#9d8163]">
            Tidak semua yang sedang tren harus jadi bagian dari rutinitasmu.
          </p>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex gap-1 rounded-full border border-white bg-[#e9dfd2]/55 p-1.5">
          {[
            { id: 'morning', label: 'Rutinitas pagi', icon: 'sun' },
            { id: 'evening', label: 'Rutinitas malam', icon: 'moon' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as typeof period)}
              aria-pressed={period === p.id}
              className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-xs transition md:px-6 ${period === p.id ? 'bg-espresso text-cream shadow-sm' : 'text-[#9c826c]'}`}
            >
              <Icon name={p.icon} size={17} />
              {p.label}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <Icon name="clock" size={13} />
          {period === 'morning'
            ? account.user?.preferences?.morningTime || '06:30'
            : account.user?.preferences?.eveningTime || '20:00'}{' '}
          · waktu untuk dirimu
        </span>
      </div>
      <div className={`${glass} mb-7 flex items-center justify-between gap-4 px-5 py-4`}>
        <span className="flex items-center gap-3">
          <IconBox name={period === 'morning' ? 'sun' : 'moon'} />
          <span>
            <strong className="block text-sm font-medium">
              {period === 'morning' ? 'Awali hari dengan lembut' : 'Akhiri hari dengan perhatian'}
            </strong>
            <span className="mt-1 block text-[10px] text-muted">
              Gunakan hanya produk yang cocok dan sesuai arahan perawatanmu.
            </span>
          </span>
        </span>
        <button
          onClick={() => void complete()}
          disabled={busy || loading}
          className={`${done ? lightButton : primaryButton} shrink-0 !gap-2 !px-4 !text-[11px]`}
        >
          <Icon name="check" size={16} />
          <span className="hidden sm:inline">{done ? 'Sudah selesai' : 'Tandai selesai'}</span>
          <span className="sm:hidden">{done ? 'Selesai' : 'Selesai?'}</span>
        </button>
      </div>
      <SectionHeading title="Pilihan skincare untuk dikenali">
        <span className="text-[10px] text-gold-dark">{products.length} pilihan</span>
      </SectionHeading>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p, i) => (
          <article key={p.id} className={`${glass} group overflow-hidden p-3`}>
            <div className="relative">
              <ProductIllustration product={p} />
              <span className="absolute left-3 top-3 rounded-full border border-white bg-white/70 px-2.5 py-1 text-[8px] font-semibold tracking-[.1em] text-[#998052]">
                {String(i + 1).padStart(2, '0')} · {p.category.toUpperCase()}
              </span>
              <button
                aria-label={`Detail ${p.name}`}
                onClick={() => open({ type: 'product', product: p })}
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white bg-white/65 text-[#8b7158]"
              >
                <Icon name="diagonal" size={14} />
              </button>
            </div>
            <div className="px-2 pb-2 pt-5">
              <Eyebrow className="text-[8px] text-gold-dark">
                {p.brand} · {p.size}
              </Eyebrow>
              <h3 className="mt-2 min-h-14 font-serif text-[23px] leading-tight">{p.name}</h3>
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                {p.description}
              </p>
              <div className="my-4 flex items-center justify-between border-y border-line/60 py-3">
                <span className="text-[9px] text-muted">Estimasi harga</span>
                <span className="text-sm font-medium text-[#8c6a40]">
                  {p.estimatedPrice
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(p.estimatedPrice)
                    : 'Cek toko resmi'}
                </span>
              </div>
              <button
                onClick={() => open({ type: 'product', product: p })}
                className={`${lightButton} w-full !text-xs`}
              >
                Kenali produk & ingredients
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!products.length && (
        <EmptyState
          title="Katalog sedang dirawat"
          text="Produk terbitan editor akan muncul di sini. Tidak ada rekomendasi otomatis tanpa data yang terverifikasi."
        />
      )}
      <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-muted">
        <Icon name="help" size={14} className="mt-0.5 shrink-0" />
        Harga adalah estimasi editorial, bukan harga live. Komposisi, ukuran, harga akhir, dan
        keaslian produk perlu diperiksa pada kemasan dan toko resmi. SERI tidak menjamin kecocokan.
      </p>
    </div>
  )
}
function ExploreScreen({ content }: { content: SeriContent }) {
  const [filter, setFilter] = useState('Semua')
  const [query, setQuery] = useState('')
  const articles = content.articles.filter(
    (a) =>
      (filter === 'Semua' || a.category === filter) &&
      `${a.title} ${a.excerpt}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div>
      <Heading
        eyebrow="A LITTLE KNOWLEDGE, A LOT OF CONFIDENCE"
        title="Kenali kulitmu. Temukan yang berarti."
        subtitle="Sains yang lebih mudah dipahami, cerita yang lebih dekat, dan suara yang bisa kamu pelajari."
      />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Semua', 'Skin barrier', 'Ingredients', 'Rutinitas', 'Sun protection'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-[11px] transition ${f === filter ? 'border-espresso bg-espresso text-cream' : 'border-white bg-white/50 text-[#9a8169] hover:bg-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-[245px]">
          <Icon name="search" className="absolute left-4 top-3.5 text-[#b5a18c]" size={16} />
          <input
            className={`${inputClass} !min-h-10 !rounded-full !py-3 pl-11 !text-xs`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari edukasi"
            placeholder="Apa yang ingin kamu ketahui?"
          />
        </div>
      </div>
      <SectionHeading title="Bacaan kecil, pemahaman besar">
        <span className="text-[10px] text-muted">{articles.length} cerita untukmu</span>
      </SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} featured />
        ))}
      </div>
      {!articles.length && (
        <EmptyState
          title="Belum menemukan yang kamu cari."
          text="Coba kata kunci lain atau pilih kategori Semua."
          icon="search"
        >
          <button
            className={lightButton}
            onClick={() => {
              setQuery('')
              setFilter('Semua')
            }}
          >
            Tampilkan semua
          </button>
        </EmptyState>
      )}
      <section className="mt-10">
        <SectionHeading title="Suara yang layak kamu kenali" />
        <p className="mb-5 max-w-2xl text-xs leading-relaxed text-muted">
          Pilihan kanal edukasi skincare dari dokter dan komunikator sains. Rekomendasi editorial,
          bukan kerja sama atau dukungan resmi terhadap SERI.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.creators.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
        </div>
      </section>
      <div className="mt-9 flex items-start gap-4 rounded-[22px] border border-white/80 bg-[#ede5d8]/45 p-6">
        <Icon name="shield" className="shrink-0 text-[#ad9161]" size={25} />
        <div>
          <h3 className="font-serif text-2xl">Pengetahuan membuatmu lebih tenang.</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Konten edukasi bukan diagnosis. Kulit setiap orang berbeda; jangan mengganti pengobatan
            berdasarkan tren atau konten media sosial.
          </p>
        </div>
      </div>
    </div>
  )
}
function CheckinScreen() {
  const { account, loading, mutate, busy, open, notify } = useAccount()
  const router = useRouter()
  const current = account.checkins.find((c) => c.day === localDay())
  const [mood, setMood] = useState('')
  const [scores, setScores] = useState([0, 0, 0, 0])
  const [note, setNote] = useState('')
  const [reaction, setReaction] = useState(false)
  const [redFlag, setRedFlag] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (current) {
      setMood(current.mood)
      setScores([current.redness, current.stinging, current.dryness, current.acne])
      setNote(current.note || '')
      setReaction(!!current.reaction)
      setRedFlag(!!current.redFlag)
    }
  }, [current?.id])
  async function save() {
    if (!account.user) return open({ type: 'auth' })
    if (!mood) {
      setError('Pilih emotikon yang paling menggambarkan kondisi kulitmu, ya.')
      return
    }
    const result = await mutate({
      operation: 'checkin',
      mood,
      note,
      reaction,
      redFlag,
      redness: scores[0],
      stinging: scores[1],
      dryness: scores[2],
      acne: scores[3],
    })
    if (!result.ok) {
      setError(result.error!)
      return
    }
    notify('Check-in tersimpan. Terima kasih sudah mendengarkan kulitmu.')
    if (redFlag) open({ type: 'safety' })
    else router.push('/progres')
  }
  return (
    <div className="mx-auto max-w-[790px]">
      <Heading
        eyebrow="A MOMENT, JUST FOR YOU"
        title="Bagaimana rasanya menjadi kamu hari ini?"
        subtitle="Tidak perlu terlihat baik-baik saja. Ceritakan apa yang benar-benar kamu rasakan."
      />
      <div className={`${glass} p-5 sm:p-8`}>
        <div className="mb-7 flex items-center gap-3">
          <IconBox name="spark" />
          <div>
            <h2 className="font-serif text-2xl">Your daily check-in</h2>
            <p className="mt-1 text-[10px] text-muted">
              {current
                ? 'Kamu bisa memperbarui check-in hari ini.'
                : 'Satu menit untuk diri sendiri.'}{' '}
              · Privat
            </p>
          </div>
          <span className="ml-auto hidden text-[10px] text-gold-dark sm:block">
            {account.user ? `Hari ke-${programDay(account.user)}` : 'Perjalanan barumu'}
          </span>
        </div>
        <h3 className="text-sm font-medium">Kulitmu terasa...</h3>
        <div className="mb-8 mt-5 grid grid-cols-5 gap-1.5 sm:gap-3">
          {moods.map((m) => (
            <button
              key={m.value}
              aria-pressed={mood === m.value}
              onClick={() => {
                setMood(m.value)
                setError('')
              }}
              className={`flex min-h-24 flex-col items-center justify-center gap-3 rounded-[20px] border p-2 transition sm:min-h-28 ${mood === m.value ? 'border-gold bg-[#ebdfc5]/60 shadow-sm' : 'border-white bg-white/30 hover:bg-white/80'}`}
            >
              <span className="text-[30px] sm:text-[39px]">{m.emoji}</span>
              <span
                className={`text-center text-[8px] leading-relaxed sm:text-[10px] ${mood === m.value ? 'font-medium text-[#8f6c38]' : 'text-muted'}`}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mb-5 border-t border-line/60 pt-5">
          <h3 className="font-serif text-2xl">Sedikit lebih detail.</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Nilai sesuai yang kamu rasakan: 0 tidak ada, 1 ringan, 2 sedang, 3 berat. Skor bukan
            penilaian kecantikanmu.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {['Kemerahan', 'Rasa perih', 'Kulit kering', 'Jerawat meradang'].map((s, i) => (
            <fieldset key={s}>
              <legend className="mb-2.5 text-xs font-medium">{s}</legend>
              <div className="flex gap-2">
                {['Tidak ada', 'Ringan', 'Sedang', 'Berat'].map((v, n) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={scores[i] === n}
                    onClick={() => setScores((a) => a.map((v, k) => (k === i ? n : v)))}
                    className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl border py-2 text-[8px] ${scores[i] === n ? 'border-[#c5ac7e] bg-[#f0e5cf] text-[#927040]' : 'border-white bg-white/40 text-[#ac9781]'}`}
                  >
                    <span className="text-sm font-medium">{n}</span>
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <label className="my-6 flex cursor-pointer items-center gap-3 border-y border-line/60 py-5">
          <input
            type="checkbox"
            checked={reaction}
            onChange={(e) => setReaction(e.target.checked)}
            className="size-4 accent-[#9a7c49]"
          />
          <span>
            <span className="block text-xs font-medium">
              Ada reaksi baru setelah memakai produk?
            </span>
            <span className="mt-1 block text-[10px] text-muted">
              Misalnya gatal, panas, atau perih yang sebelumnya tidak ada.
            </span>
          </span>
        </label>
        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#eed7c8] bg-[#fbefe5]/60 p-4">
          <input
            type="checkbox"
            checked={redFlag}
            onChange={(e) => setRedFlag(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-[#a86646]"
          />
          <span>
            <span className="text-xs font-medium text-[#a37655]">Ada tanda bahaya</span>
            <span className="mt-1 block text-[10px] leading-relaxed text-[#b39379]">
              Bengkak hebat, nyeri berat, luka meluas, atau sesak napas. Segera cari bantuan medis;
              jangan menunggu check-in.
            </span>
          </span>
        </label>
        <label htmlFor="checkin-note" className="text-xs font-medium">
          Ada cerita di balik harimu? <span className="font-normal text-muted">(opsional)</span>
        </label>
        <textarea
          id="checkin-note"
          maxLength={1500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tidurmu, perasaanmu, atau hal kecil yang kamu sadari..."
          className={`${inputClass} mt-3 min-h-28 resize-y !text-sm`}
        />
        {error && (
          <p role="alert" className="mt-4 text-xs text-[#a35d40]">
            {error}
          </p>
        )}
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted">
            Skor kondisi{' '}
            <strong className="ml-2 font-serif text-3xl text-[#9f824e]">
              {scores.reduce((a, b) => a + b, 0)}
            </strong>
            <span className="ml-1 text-[10px]">/ 12</span>
          </span>
          <button disabled={busy || loading} onClick={() => void save()} className={primaryButton}>
            {busy ? 'Menyimpan...' : current ? 'Perbarui check-in' : 'Simpan check-in'}
            <Icon name="arrow" size={17} />
          </button>
        </div>
        <p className="mt-5 text-center text-[9px] leading-relaxed text-[#b7a38e]">
          Tersimpan privat di akunmu. Emotikon menggambarkan perasaan, bukan diagnosis kondisi
          kulit.
        </p>
      </div>
    </div>
  )
}
function ProgressScreen() {
  const { account, loading, open } = useAccount()
  const points = [...account.checkins].slice(0, 14).reverse()
  const first = points[0]?.score ?? 0
  const last = points.at(-1)?.score ?? 0
  const completed =
    account.routines.filter((r) => r.morning).length +
    account.routines.filter((r) => r.evening).length
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${points.length === 1 ? 250 : 20 + (i * 460) / (points.length - 1)} ${140 - (p.score || 0) * 10}`,
    )
    .join(' ')
  return (
    <div className="mx-auto max-w-[1040px]">
      <Heading
        eyebrow="YOUR STORY, ONE DAY AT A TIME"
        title="Bukan perlombaan. Ini perjalananmu."
        subtitle="Rayakan perhatian yang sudah kamu berikan, bukan hanya perubahan yang terlihat."
      />
      <div className="mb-7 grid grid-cols-3 gap-2.5 md:gap-5">
        {[
          {
            icon: 'calendar',
            value: account.user ? programDay(account.user) : '—',
            unit: 'hari',
            text: 'Menemani kulitmu',
          },
          {
            icon: 'checkin',
            value: account.checkinCount,
            unit: 'check-in',
            text: 'Cerita yang tercatat',
          },
          { icon: 'leaf', value: completed, unit: 'rutinitas', text: 'Bentuk perhatianmu' },
        ].map((s) => (
          <div key={s.text} className={`${glass} p-4 md:p-6`}>
            <Icon name={s.icon} size={22} className="mb-5 text-[#b69b69]" />
            <strong className="font-serif text-3xl md:text-4xl">{s.value}</strong>
            <span className="ml-1.5 text-[9px] text-gold-dark md:text-[11px]">{s.unit}</span>
            <p className="mt-2 text-[9px] leading-relaxed text-muted md:text-xs">{s.text}</p>
          </div>
        ))}
      </div>
      {loading ? (
        <p className="p-8 text-center text-sm text-muted">Membuka cerita kulitmu...</p>
      ) : !points.length ? (
        <EmptyState
          title="Hal baik dimulai dari satu check-in."
          text={
            account.user
              ? 'Belum ada catatan. Luangkan satu menit dan mulai cerita pertamamu.'
              : 'Masuk ke akun untuk menyimpan dan melihat perkembangan kulitmu.'
          }
          icon="chart"
        >
          {account.user ? (
            <Link href="/check-in" className={primaryButton}>
              Mulai check-in
              <Icon name="arrow" size={16} />
            </Link>
          ) : (
            <button className={primaryButton} onClick={() => open({ type: 'auth' })}>
              Masuk ke SERI
            </button>
          )}
        </EmptyState>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-[27px] bg-gradient-to-br from-[#543727] to-[#2d1b11] p-6 text-cream md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow className="text-[#c8b084]">
                  SKOR KONDISI · {points.length} CATATAN TERAKHIR
                </Eyebrow>
                <div className="mt-4">
                  <strong className="font-serif text-[53px] leading-none">{last}</strong>
                  <span className="ml-1 text-xl text-[#ac9279]">/12</span>
                </div>
              </div>
              <span className="mt-3 rounded-full border border-[#e7cc9a]/15 bg-white/5 px-3 py-2 text-[10px] text-gold-light">
                {points.length > 1
                  ? `${Math.abs(first - last)} poin ${last < first ? 'lebih rendah' : last > first ? 'lebih tinggi' : '· tetap'} dari catatan pertama`
                  : 'Catatan pertamamu'}
              </span>
            </div>
            <div className="mt-6 flex gap-3">
              <div className="flex flex-col justify-between pb-7 text-[9px] text-[#997e62]">
                <span>12</span>
                <span>6</span>
                <span>0</span>
              </div>
              <div className="min-w-0 flex-1">
                <svg
                  viewBox="0 0 500 160"
                  preserveAspectRatio="none"
                  className="h-40 w-full overflow-visible"
                  role="img"
                  aria-label="Grafik skor kondisi kulit berdasarkan check-in tersimpan"
                >
                  <path
                    d="M0 20H500M0 80H500M0 140H500"
                    stroke="#795d43"
                    strokeWidth=".5"
                    strokeDasharray="3 7"
                  />
                  {points.length > 1 && (
                    <path
                      d={path}
                      stroke="#d6b777"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}
                  {points.map((p, i) => (
                    <circle
                      key={p.id}
                      cx={points.length === 1 ? 250 : 20 + (i * 460) / (points.length - 1)}
                      cy={140 - (p.score || 0) * 10}
                      r="4"
                      fill="#f0deba"
                      stroke="#c1a36a"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="mt-2 flex justify-between gap-1 text-[8px] text-[#b29a7d]">
                  {points
                    .filter((_, i) => points.length <= 7 || i % 2 === 0 || i === points.length - 1)
                    .map((p) => (
                      <span key={p.id}>
                        {new Date(`${p.day}T12:00:00+07:00`).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          timeZone: 'Asia/Jakarta',
                        })}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[9px] leading-relaxed text-[#b69d80]">
              <Icon name="help" size={13} />
              Skor lebih rendah berarti lebih sedikit keluhan yang kamu catat; bukan bukti sembuh
              atau diagnosis.
            </p>
          </section>
          <div className="mb-4 mt-8">
            <SectionHeading
              title="Jurnal kecil, cerita yang berarti"
              href="/check-in"
              action="Check-in hari ini"
            />
          </div>
          <div className={`${glass} divide-y divide-line/50 px-5`}>
            {account.checkins.map((c) => (
              <div className="flex items-start gap-4 py-5" key={c.id}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f2e9dc] text-2xl">
                  {moods.find((m) => m.value === c.mood)?.emoji || '🙂'}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-medium">
                    {new Date(`${c.day}T12:00:00+07:00`).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Jakarta',
                    })}
                  </strong>
                  <span className="mt-1 block text-[10px] text-gold-dark">
                    {moods.find((m) => m.value === c.mood)?.label}
                  </span>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-muted">
                    {c.note || 'Hari ini aku meluangkan waktu untuk diriku.'}
                  </p>
                  <p className="mt-2 text-[9px] text-[#aa937c]">
                    Kemerahan {c.redness} · Perih {c.stinging} · Kering {c.dryness} · Meradang{' '}
                    {c.acne}
                    {c.reaction ? ' · Reaksi baru' : ''}
                    {c.redFlag ? ' · Tanda bahaya dicatat' : ''}
                  </p>
                </div>
                <span className="shrink-0 font-serif text-2xl text-[#ac8a51]">
                  {c.score}
                  <small className="ml-0.5 font-sans text-[9px] text-muted">/12</small>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <section className={`${glass} mt-7 p-6`}>
        <Eyebrow className="text-gold-dark">PROGRAM KULITMU</Eyebrow>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {['Reset', 'Pemulihan', 'Penguatan'].map((s, i) => (
            <div key={s} className="flex items-start gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs ${i === 0 ? 'border-[#d6bf93] bg-[#e6d6b6] text-[#806334]' : 'border-[#ded3c4] text-[#b9a791]'}`}
              >
                {i === 0 ? 1 : <Icon name="lock" size={13} />}
              </span>
              <div>
                <strong className="text-xs font-medium">{s}</strong>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  {i === 0
                    ? 'Mengenali kulit dan rutinitas dasar'
                    : 'Setelah evaluasi kondisi kulit'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[10px] leading-relaxed text-muted">
          Tidak ada tanggal pasti untuk sembuh. Tahap perawatan perlu disesuaikan bersama tenaga
          kesehatan bila diperlukan.
        </p>
      </section>
    </div>
  )
}
function ProfileScreen() {
  const { account, loading, open, busy } = useAccount()
  const user = account.user
  function row(icon: string, title: string, subtitle: string, type: string, red = false) {
    return (
      <button
        onClick={() => open({ type })}
        className={`flex min-h-[76px] w-full items-center gap-4 py-4 text-left ${red ? 'text-[#a16b56]' : ''}`}
      >
        <IconBox name={icon} />
        <span className="min-w-0 flex-1">
          <strong className="block text-xs font-medium">{title}</strong>
          <span className="mt-1 block text-[10px] leading-relaxed text-muted">{subtitle}</span>
        </span>
        <Icon name="chevron" className="text-[#b4a087]" size={16} />
      </button>
    )
  }
  if (loading)
    return (
      <div role="status" className="mx-auto max-w-[1060px] space-y-5 py-6">
        <h1 className="font-serif text-3xl">Membuka ruang pribadimu...</h1>
        <div className="h-28 animate-pulse rounded-3xl bg-white/50" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/40" />
      </div>
    )
  return (
    <div className="mx-auto max-w-[1060px]">
      <div className="mb-8 flex items-center justify-between">
        <Eyebrow className="text-gold-dark">YOUR OWN LITTLE SPACE</Eyebrow>
        <button
          className="flex min-h-10 items-center gap-2 text-xs text-gold-dark"
          onClick={() => open({ type: user ? 'profile' : 'auth' })}
        >
          <Icon name="edit" size={15} />
          {user ? 'Edit profil' : 'Masuk / daftar'}
        </button>
      </div>
      <section className="mb-8 flex flex-wrap items-center gap-5 md:gap-7">
        <button
          aria-label="Ubah foto profil"
          onClick={() => open({ type: user ? 'avatar' : 'auth' })}
          className="group relative"
        >
          <Avatar size="large" />
          <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#deceb1] text-[#8e714b]">
            <Icon name="camera" size={14} />
          </span>
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-[45px] leading-tight tracking-[-1px] md:text-[55px]">
              {loading ? 'Membuka profil...' : user?.name || 'Halo, dirimu.'}
            </h1>
            <span className="rounded-full border border-[#dac7a4]/70 bg-[#eee0bf]/50 px-3 py-1 text-[9px] font-semibold tracking-[.1em] text-[#a18248]">
              {user?.plan === 'pro' ? 'SERI PRO' : 'FREE'}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {user?.email || 'Ruang untuk semua cerita kulitmu.'}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#a68c71]">
            {user ? (
              <>
                <span>
                  Member sejak{' '}
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>·</span>
                <span>Hari ke-{programDay(user)} merawat diri</span>
              </>
            ) : (
              <button
                onClick={() => open({ type: 'auth' })}
                className="font-medium underline underline-offset-4"
              >
                Mulai perjalanan dengan akunmu
              </button>
            )}
          </p>
        </div>
      </section>
      <div className="grid items-start gap-7 xl:grid-cols-[1.3fr_1fr]">
        <div>
          <section className={`${glass} mb-7 p-6`}>
            <div className="flex items-center justify-between">
              <Eyebrow className="text-gold-dark">SKIN PROFILE</Eyebrow>
              <button
                aria-label="Ubah profil kulit"
                className="p-2 text-[#ac9062]"
                onClick={() => open({ type: user ? 'skin' : 'auth' })}
              >
                <Icon name="edit" size={16} />
              </button>
            </div>
            <h2 className="mt-2 font-serif text-[28px]">
              {user?.skinProfile?.skinType && user.skinProfile.skinType !== 'Belum diisi'
                ? `Kulit ${user.skinProfile.skinType.toLowerCase()}, ceritamu sendiri.`
                : 'Mari kenalan dengan kulitmu.'}
            </h2>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              {user?.skinProfile?.completedAt
                ? 'Profil awal berdasarkan jawabanmu saat onboarding, bukan hasil diagnosis AI.'
                : 'Lengkapi profil awal untuk mencatat jenis kulit dan perhatian utamamu. Tidak ada penilaian medis otomatis.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {user?.skinProfile?.concerns?.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#e0cdb1]/60 bg-[#f3ead9]/60 px-3 py-1.5 text-[10px] text-[#9a7c49]"
                >
                  {c}
                </span>
              ))}
            </div>
            <button
              onClick={() => open({ type: user ? 'skin' : 'auth' })}
              className="mt-4 flex items-center gap-2 text-xs font-medium text-gold-dark"
            >
              {user?.skinProfile?.completedAt ? 'Perbarui profil kulit' : 'Isi profil kulitku'}
              <Icon name="arrow" size={14} />
            </button>
          </section>
          <section className="mb-7">
            <SectionHeading title="Perawatanku" />
            <div className={`${glass} divide-y divide-line/50 px-5`}>
              {[
                {
                  icon: 'checkin',
                  title: 'Daily check-in',
                  sub: 'Satu menit untuk mendengarkan kulitmu',
                  href: '/check-in',
                },
                {
                  icon: 'chart',
                  title: 'Progres kulitku',
                  sub: `${account.checkinCount} check-in · setiap cerita berarti`,
                  href: '/progres',
                },
              ].map((r) => (
                <Link
                  key={r.title}
                  href={r.href}
                  className="flex min-h-[80px] items-center gap-4 py-4"
                >
                  <IconBox name={r.icon} />
                  <span className="flex-1">
                    <strong className="text-xs font-medium">{r.title}</strong>
                    <span className="mt-1.5 block text-[10px] text-muted">{r.sub}</span>
                  </span>
                  <Icon name="chevron" className="text-[#b4a087]" size={16} />
                </Link>
              ))}
            </div>
          </section>
          <section className="mb-7">
            <SectionHeading title="Program kulitmu" />
            <div className={`${glass} p-5`}>
              <div className="flex items-center gap-4">
                <IconBox name="leaf" />
                <div>
                  <strong className="text-xs font-medium">
                    {user
                      ? `Fase ${user.phase === 'pemulihan' ? '2 · Pemulihan' : user.phase === 'penguatan' ? '3 · Penguatan' : '1 · Reset'}`
                      : 'Belum memulai program'}
                  </strong>
                  <p className="mt-1 text-[10px] text-muted">
                    {user
                      ? `Hari ke-${programDay(user)} · tumbuh dengan ritmemu sendiri`
                      : 'Mulai dengan mengisi profil kulitmu'}
                  </p>
                </div>
              </div>
              <Link
                href="/rutinitas"
                className="mt-4 flex items-center justify-between border-t border-line/50 pt-4 text-[11px] text-gold-dark"
              >
                Lihat rutinitas dan pilihan produk
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          </section>
          <section>
            <SectionHeading title="Preferensi" />
            <div className={`${glass} divide-y divide-line/50 px-5`}>
              {row(
                'bell',
                'Pengaturan notifikasi',
                user?.preferences?.notifications
                  ? 'Pengingat diaktifkan'
                  : 'Atur izin dan cara SERI menyapamu',
                'notifications',
              )}
              {row(
                'clock',
                'Pengingat lembut',
                `${user?.preferences?.morningTime || '06:30'} pagi · ${user?.preferences?.eveningTime || '20:00'} malam · evaluasi mingguan`,
                'reminders',
              )}
            </div>
          </section>
        </div>
        <div>
          <section className="relative mb-7 overflow-hidden rounded-[25px] border border-[#e2cf9d]/30 bg-gradient-to-br from-[#5b3d29] via-[#3c281c] to-[#291a13] p-6 text-cream">
            <span className="absolute -right-8 -top-8 size-36 rounded-full bg-[#dfbf79]/10 blur-2xl" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3b477]/35 px-3 py-1.5 text-[9px] font-semibold tracking-[.14em] text-gold-light">
              <Icon name="star" size={12} />
              SERI PRO
            </span>
            <h2 className="mt-4 font-serif text-[29px] leading-tight">
              A little more care.
              <br />
              <span className="text-[#d4b878]">Just for you.</span>
            </h2>
            <p className="mt-3 text-[11px] leading-relaxed text-[#c0a88f]">
              Kenali rencana fitur pendampingan yang lebih personal.
            </p>
            <button
              onClick={() => open({ type: 'pro' })}
              className="mt-5 flex min-h-11 w-full items-center justify-between rounded-full bg-gradient-to-r from-[#ead5a2] to-[#bfa068] px-5 py-3 text-xs font-semibold text-[#4e331f]"
            >
              Upgrade to Pro
              <Icon name="arrow" size={16} />
            </button>
          </section>
          <section>
            <SectionHeading title="Akun" />
            <div className={`${glass} divide-y divide-line/50 px-5`}>
              {row(
                'user',
                'Informasi akun',
                'Nama, email, nomor telepon, dan akun Google',
                'profile',
              )}
              {row('shield', 'Privasi & data', 'Kamu yang memegang kendali', 'privacy')}
              {row('help', 'Help & feedback', 'Butuh bantuan atau punya ide?', 'help')}
              {row('heart', 'About SERI', 'Teman bertumbuh bersama kulitmu', 'about')}
              {row(
                'trash',
                'Delete account',
                'Hapus akun dan seluruh catatan pribadi',
                'delete',
                true,
              )}
            </div>
          </section>
          <button
            disabled={busy}
            onClick={() => (user ? open({ type: 'signout' }) : open({ type: 'auth' }))}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#d7c9b5]/60 bg-white/35 text-xs text-[#967d64]"
          >
            <Icon name={user ? 'logout' : 'user'} size={17} />
            {user ? 'Sign out' : 'Masuk ke akun SERI'}
          </button>
        </div>
      </div>
    </div>
  )
}
function ChatScreen({ content }: { content: SeriContent }) {
  const { account, open } = useAccount()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
    { role: 'seri' | 'user'; text: string; article?: SeriContent['articles'][number] }[]
  >([
    {
      role: 'seri',
      text: 'Hai, aku SERI. Kita bisa mulai dari hal kecil yang ingin kamu pahami tentang kulitmu. Saat ini aku menjawab dari panduan edukasi terkurasi, bukan model AI atau konsultasi medis.',
    },
  ])
  const end = useRef<HTMLDivElement>(null)
  function send(text = input) {
    if (!text.trim()) return
    const query = text.toLowerCase()
    const article =
      content.articles.find((a) =>
        `${a.title} ${a.category}`
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, '')
          .split(/\s+/)
          .some((w) => w.length > 4 && query.includes(w)),
      ) || content.articles.find((a) => query.includes('kering') && a.category === 'Skin barrier')
    const warning = /sesak|bengkak|luka|sakit|nyeri|obat|hamil|resep/.test(query)
    setMessages((m) => [
      ...m,
      { role: 'user', text: text.slice(0, 1000) },
      {
        role: 'seri',
        text: warning
          ? 'Untuk keluhan berat, bengkak, atau sesak napas, segera cari bantuan medis. Untuk obat, kehamilan, dan perawatan khusus, tanyakan langsung kepada dokter. Aku tidak bisa mendiagnosis atau mengganti pengobatanmu.'
          : article
            ? `${article.excerpt} Kamu bisa membaca catatan lengkapnya di bawah. Ini edukasi umum, bukan rekomendasi personal.`
            : 'Aku belum memiliki jawaban terverifikasi untuk pertanyaan itu. Kamu bisa membaca topik skin barrier, ingredients, atau rutinitas di Explore. Untuk keluhan yang menetap, konsultasikan dengan dokter, ya.',
        article: warning ? undefined : article,
      },
    ])
    setInput('')
  }
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages.length])
  return (
    <div className="mx-auto max-w-[850px]">
      <Heading
        eyebrow="A LITTLE CLARITY FOR YOUR SKINCARE"
        title="Cerita saja. Kamu tidak sendirian."
        subtitle="Ruang yang lebih tenang untuk bertanya dan belajar memahami kulitmu."
      />
      <section className={`${glass} overflow-hidden`}>
        <div className="flex items-center gap-3 border-b border-line/50 p-5">
          <span className="flex size-11 items-center justify-center rounded-full border border-[#d5bc87]/45 bg-gradient-to-br from-[#eddcb7] to-[#bca16b] text-[#76572c]">
            <Icon name="spark" size={24} />
          </span>
          <div>
            <h2 className="font-serif text-xl">SERI, teman kulitmu.</h2>
            <p className="mt-1 text-[9px] text-gold-dark">
              Mode panduan edukasi · AI generatif belum terhubung
            </p>
          </div>
          <Icon name="shield" className="ml-auto text-[#b6a17e]" size={20} />
        </div>
        <div
          className="flex max-h-[520px] min-h-[330px] flex-col gap-5 overflow-y-auto p-4 sm:p-7"
          role="log"
          aria-label="Percakapan dengan SERI"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex max-w-[93%] gap-2.5 sm:max-w-[85%] ${m.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              {m.role === 'seri' && (
                <Icon name="spark" size={18} className="mt-3 shrink-0 text-[#b59b68]" />
              )}
              <div
                className={`rounded-2xl px-5 py-4 text-sm leading-[1.85] ${m.role === 'user' ? 'rounded-tr-sm bg-[#e8d8bd]/65 text-[#816843]' : 'rounded-tl-sm bg-white/70 text-[#96806c]'}`}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                {m.article && (
                  <button
                    onClick={() => open({ type: 'article', article: m.article })}
                    className="mt-4 flex items-center gap-2 border-t border-line/50 pt-3 text-[11px] font-medium text-gold-dark"
                  >
                    <Icon name="book" size={15} />
                    {m.article.title}
                    <Icon name="arrow" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={end} />
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {['Kenapa skin barrier penting?', 'Rutinitas yang sederhana', 'Mengenal ingredients'].map(
            (p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-[#dacbb6]/60 bg-white/45 px-3 py-2 text-[10px] text-[#a18961]"
              >
                {p}
              </button>
            ),
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="mx-5 mb-3 flex items-center gap-2 rounded-full border border-white bg-white/75 p-1.5"
        >
          <input
            aria-label="Pesan untuk SERI"
            maxLength={1000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Apa yang ingin kamu tanyakan${account.user ? `, ${account.user.name.split(' ')[0]}` : ''}?`}
            className="min-h-11 w-0 flex-1 rounded-full bg-transparent px-4 text-sm outline-none placeholder:text-[#b6a38b]"
          />
          <button
            aria-label="Kirim pesan"
            disabled={!input.trim()}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-espresso text-gold-light disabled:opacity-40"
          >
            <Icon name="send" size={19} />
          </button>
        </form>
        <p className="px-5 pb-5 text-center text-[9px] leading-relaxed text-muted">
          Panduan berbasis artikel, bukan jawaban AI. Percakapan tidak disimpan. Untuk gejala medis,
          konsultasikan dengan dokter.
        </p>
      </section>
    </div>
  )
}
