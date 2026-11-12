'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Article, Creator, Media, Product } from '@/payload-types'
import { useAccount } from './account-provider'
import { Icon } from './icon'

export const glass =
  'rounded-[24px] border border-white/90 bg-white/65 shadow-[0_6px_28px_#51331e04,inset_0_1px_0_#ffffff] backdrop-blur-xl'
export const primaryButton =
  'inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-[#543726] disabled:cursor-wait disabled:opacity-50'
export const lightButton =
  'inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#d9cec0]/60 bg-white/55 px-5 py-2.5 text-sm font-medium text-espresso transition hover:bg-white disabled:opacity-50'
export const inputClass =
  'min-h-12 w-full rounded-2xl border border-line bg-white/65 px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15'
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] font-semibold tracking-[.17em] uppercase ${className}`}>
      {children}
    </span>
  )
}
export function Heading({
  title,
  subtitle,
  eyebrow,
}: {
  title: string
  subtitle: string
  eyebrow?: string
}) {
  return (
    <div className="mb-7 md:mb-9">
      {eyebrow && <Eyebrow className="text-gold-dark">{eyebrow}</Eyebrow>}
      <h1 className="mt-3 font-serif text-[34px] leading-[1.2] tracking-[-1.1px] md:text-[43px]">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{subtitle}</p>
    </div>
  )
}
export function SectionHeading({
  title,
  href,
  action = 'Lihat semua',
  children,
}: {
  title: string
  href?: string
  action?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-serif text-[23px] leading-tight tracking-[-.5px] md:text-[25px]">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-2 py-2 text-xs text-gold-dark hover:text-espresso"
        >
          {action}
          <Icon name="arrow" size={16} />
        </Link>
      )}
      {children}
    </div>
  )
}
export function IconBox({
  name,
  dark = false,
  className = '',
}: {
  name: string
  dark?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl ${dark ? 'bg-espresso text-gold-light' : 'bg-[#eee7db]/65 text-gold-dark'} ${className}`}
    >
      <Icon name={name} size={21} />
    </span>
  )
}
export function MediaImage({
  media,
  className = '',
  sizes = '50vw',
  priority = false,
}: {
  media?: string | Media | null
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!media || typeof media === 'string' || !media.url)
    return (
      <div
        className={`flex size-full items-center justify-center bg-[#e8ddd0] text-[#ad9274] ${className}`}
      >
        <Icon name="leaf" size={45} />
      </div>
    )
  return (
    <Image
      src={media.url}
      alt={media.alt || 'Ilustrasi perawatan kulit'}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      priority={priority}
    />
  )
}
export function Avatar({ size = 'small' }: { size?: 'small' | 'large' }) {
  const { account } = useAccount()
  const large = size === 'large'
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#dcc3aa] to-[#b98c72] font-serif text-white ${large ? 'size-24 text-4xl md:size-28' : 'size-10 text-lg'}`}
    >
      {account.user?.avatarURL ? (
        <Image
          src={account.user.avatarURL}
          alt="Foto profil kamu"
          fill
          sizes={large ? '112px' : '40px'}
          className="object-cover"
        />
      ) : (
        account.user?.name?.charAt(0).toUpperCase() || <Icon name="user" size={large ? 42 : 21} />
      )}
    </span>
  )
}
export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article
  featured?: boolean
}) {
  const { open } = useAccount()
  return (
    <button
      onClick={() => open({ type: 'article', article })}
      className={`group min-w-0 overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-lg ${glass}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-52' : 'h-40'}`}>
        <MediaImage
          media={article.image}
          className="transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-[9px] font-semibold tracking-wider text-espresso backdrop-blur-md">
          {article.category.toUpperCase()}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-espresso/65 px-2.5 py-1 text-[9px] text-white backdrop-blur-md">
          <Icon name="clock" size={11} />
          {article.readMinutes || 3} menit
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-[21px] leading-snug tracking-tight">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-[10px] text-gold-dark">
          <span>Catatan dari SERI</span>
          <Icon name="diagonal" size={17} />
        </div>
      </div>
    </button>
  )
}
export function CreatorCard({ creator }: { creator: Creator }) {
  const { open } = useAccount()
  return (
    <button
      onClick={() => open({ type: 'creator', creator })}
      className={`${glass} group flex w-full items-center gap-3.5 p-4 text-left transition hover:bg-white/90`}
    >
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#e9ddc5] to-[#d4bcb1] font-serif text-lg text-[#76533d]">
        {creator.portrait && typeof creator.portrait === 'object' ? (
          <MediaImage media={creator.portrait} sizes="48px" />
        ) : (
          creator.initials || creator.name.slice(0, 2)
        )}
      </span>
      <span className="min-w-0">
        <strong className="block truncate text-xs font-semibold">{creator.name}</strong>
        <span className="mt-1 block truncate text-[10px] text-muted">{creator.expertise}</span>
      </span>
      <Icon
        className="ml-auto shrink-0 text-gold-dark transition group-hover:-translate-y-0.5"
        name="diagonal"
        size={17}
      />
    </button>
  )
}
export function ProductIllustration({
  product,
  small = false,
}: {
  product: Product
  small?: boolean
}) {
  const jar = product.category === 'Pelembap'
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f1ece2] via-[#f9f5ec] to-[#e7d8c6] ${small ? 'h-44' : 'h-56'}`}
    >
      {product.image && typeof product.image === 'object' ? (
        <MediaImage media={product.image} sizes="300px" />
      ) : (
        <div
          className={`relative flex flex-col items-center drop-shadow-[8px_14px_9px_#5f442025] ${jar ? 'mt-12' : 'mt-4'}`}
        >
          <div
            className={`${jar ? 'h-5 w-28 rounded-t-xl bg-[#a9afa0]' : 'h-7 w-10 rounded-t-md bg-[#aba998]'}`}
          />
          <div
            className={`flex flex-col items-center justify-center border border-white/80 bg-gradient-to-r from-[#eee9df] via-[#fffdf6] to-[#e2ddcf] ${jar ? 'h-20 w-28 rounded-b-2xl' : 'h-32 w-20 rounded-t-xl rounded-b-2xl'}`}
          >
            <span className="text-[9px] font-bold tracking-tight text-[#5b675b]">
              {product.brand}
            </span>
            <span className="mt-3 max-w-16 text-center text-[6px] leading-relaxed tracking-wide text-[#998d77]">
              {product.category === 'Pembersih'
                ? 'GENTLE\nSKIN CLEANSER'
                : product.category === 'Sunscreen'
                  ? 'UV MOISTURE\nSPF 50+'
                  : 'MOISTURISING\nCREAM'}
            </span>
            <span className="mt-3 h-[2px] w-5 bg-[#c5b387]" />
            <span className="mt-1 text-[5px] text-muted">{product.size}</span>
          </div>
        </div>
      )}
      {!product.image && (
        <span className="absolute bottom-2 right-3 text-[7px] tracking-wider text-[#ab9d87]">
          ILUSTRASI PRODUK
        </span>
      )}
    </div>
  )
}
export function EmptyState({
  title,
  text,
  icon = 'leaf',
  children,
}: {
  title: string
  text: string
  icon?: string
  children?: ReactNode
}) {
  return (
    <div className={`${glass} p-7 text-center`}>
      <span className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-[#eee4d5]/70 text-gold-dark">
        <Icon name={icon} size={25} />
      </span>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{text}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
