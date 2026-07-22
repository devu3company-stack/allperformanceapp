import Image from 'next/image'

type AppBannerVariant = 'aluno' | 'gestor'

const bannerConfig = {
  aluno: {
    src: '/banners/mobile-app-banner.svg',
    alt: 'Banner do app mobile',
    title: 'Banner do app',
    description: 'Substitua por arte final em 1080 x 560 px',
    heightClassName: 'h-[180px] sm:h-[200px]',
    sizes: '(max-width: 640px) 100vw, 520px',
  },
  gestor: {
    src: '/banners/web-panel-banner.svg',
    alt: 'Banner do painel web',
    title: 'Banner do painel',
    description: 'Substitua por arte final em 1600 x 420 px',
    heightClassName: 'h-[180px] sm:h-[220px]',
    sizes: '(max-width: 1024px) 100vw, 1280px',
  },
} satisfies Record<AppBannerVariant, {
  src: string
  alt: string
  title: string
  description: string
  heightClassName: string
  sizes: string
}>

export function AppBanner({
  variant,
  src,
}: {
  variant: AppBannerVariant
  src?: string | null
}) {
  const banner = bannerConfig[variant]
  const resolvedSrc = src ?? banner.src
  const isRemoteImage = /^https?:\/\//.test(resolvedSrc)
  const showPlaceholderContent = resolvedSrc === banner.src

  return (
    <section
      className={`relative overflow-hidden rounded-[24px] border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.18)] ${banner.heightClassName}`}
    >
      {isRemoteImage ? (
        <img
          src={resolvedSrc}
          alt={banner.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={banner.alt}
          fill
          priority
          sizes={banner.sizes}
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {showPlaceholderContent && (
        <div className="absolute inset-x-0 bottom-0 flex items-end p-4 sm:p-5 lg:p-6">
          <div className="max-w-[280px] rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-white backdrop-blur-md sm:max-w-sm sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/65">
              Placeholder
            </p>
            <h2 className="mt-1 text-base font-bold sm:text-lg">
              {banner.title}
            </h2>
            <p className="mt-1 text-xs leading-5 text-white/78 sm:text-sm">
              {banner.description}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
