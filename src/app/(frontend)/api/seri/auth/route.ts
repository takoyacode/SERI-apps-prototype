import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { errorResponse, readInput, sameOrigin, secureRequest } from '@/lib/seri-request'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse('Permintaan tidak diizinkan.', 403)
  let input
  try {
    input = await readInput(request)
  } catch {
    return errorResponse('Data formulir tidak valid.')
  }
  const secure = secureRequest(request)
  if (input.operation === 'logout') {
    await appAuth.logout(secure)
    return Response.json({ ok: true })
  }
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = typeof input.password === 'string' ? input.password : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    return errorResponse('Periksa alamat emailmu.', 400, { email: 'Email tidak valid.' })
  if (password.length < 10 || password.length > 128)
    return errorResponse('Kata sandi harus 10–128 karakter.', 400, {
      password: 'Gunakan minimal 10 karakter.',
    })
  try {
    if (input.operation === 'register') {
      const name = typeof input.name === 'string' ? input.name.trim() : ''
      if (name.length < 2 || name.length > 60 || input.consent !== true)
        return errorResponse('Isi nama dan setujui kebijakan privasi.')
      const payload = await getPayloadClient()
      await payload.create({
        collection: 'users',
        overrideAccess: false,
        data: { name, email, password },
      })
    } else if (input.operation !== 'login') return errorResponse('Operasi tidak dikenal.')
    await appAuth.login(email, password, secure)
    return Response.json({ ok: true })
  } catch {
    return errorResponse(
      input.operation === 'register'
        ? 'Pendaftaran belum berhasil. Jika sudah memiliki akun, coba masuk.'
        : 'Email atau kata sandi tidak cocok, atau akun sedang dikunci sementara.',
      400,
    )
  }
}
