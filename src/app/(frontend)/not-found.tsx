import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center rounded-[28px] border border-white bg-white/60 px-8 py-16 text-center">
      <span className="text-xs tracking-[.2em] text-gold-dark">404 · AMBIL JEDA SEBENTAR</span>
      <h1 className="mt-5 font-serif text-4xl">Sepertinya kita salah jalan.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Halaman ini tidak ditemukan. Mari kembali ke ruang yang terasa lebih akrab.
      </p>
      <Link className="mt-7 rounded-full bg-espresso px-6 py-3 text-sm text-cream" href="/">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
