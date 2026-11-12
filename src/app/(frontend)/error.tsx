'use client'
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white bg-white/65 p-8 text-center">
      <h1 className="font-serif text-3xl">Kita ambil jeda sebentar.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Halaman ini belum bisa dimuat. Catatanmu tetap berada di akun; coba kembali beberapa saat
        lagi.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-espresso px-6 py-3 text-sm text-cream"
      >
        Coba lagi
      </button>
    </div>
  )
}
