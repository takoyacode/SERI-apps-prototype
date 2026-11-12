import type { SVGProps } from 'react'

export function Icon({
  name,
  size = 22,
  ...props
}: SVGProps<SVGSVGElement> & { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </>
    ),
    leaf: (
      <>
        <path d="M19 3C7 2 2 9 6 16s16 1 13-13Z" />
        <path d="M4 21 15 9" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    checkin: (
      <>
        <rect x="4" y="4" width="16" height="17" rx="4" />
        <path d="M8 2v4m8-4v4m-8 8 3 3 5-6" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18M7 15l5-5 4 2 5-7" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z" />
        <path d="m20 2 .7 1.3L22 4l-1.3.7L20 6" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    diagonal: <path d="M5 19 19 5M6 5h13v13" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    bell: (
      <>
        <path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4Zm5 4h4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20 14A8 8 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" />,
    heart: <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 3 12 8 15 5-3 13-10 8-15Z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    send: (
      <>
        <path d="m3 3 19 9-19 9 4-9Zm4 9h15" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    drop: <path d="M12 2C10 6 5 11 5 15a7 7 0 0 0 14 0c0-4-5-9-7-13Z" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01" />
      </>
    ),
    logout: <path d="M10 4H4v16h6m-1-8h12m-4-4 4 4-4 4" />,
    camera: (
      <>
        <path d="M3 7h4l2-3h6l2 3h4v13H3Z" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
    book: (
      <>
        <path d="M12 6C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 2Zm0 0v14" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
      </>
    ),
    play: <path d="m9 5 11 7-11 7Z" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 6 6" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="2" fill="currentColor" />
        <circle cx="15" cy="17" r="2" fill="currentColor" />
      </>
    ),
    bag: (
      <>
        <path d="M4 7h16l1 14H3Zm4 0V6a4 4 0 0 1 8 0v1" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: <path d="m5 3 4 1 1 5-3 2a13 13 0 0 0 6 6l2-3 5 1 1 4c-4 7-24-9-16-16Z" />,
    edit: (
      <>
        <path d="m4 15 12-12 5 5L9 20l-6 1ZM14 5l5 5" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
      </>
    ),
    settings: (
      <>
        <path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.spark}
    </svg>
  )
}
