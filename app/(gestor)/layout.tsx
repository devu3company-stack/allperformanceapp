import { getBannerSettings } from '@/lib/banner-settings'
import { GestorShell } from '@/components/gestor-shell'

export default async function GestorLayout({ children }: { children: React.ReactNode }) {
  const banners = await getBannerSettings()

  return <GestorShell bannerSrc={banners.webUrl}>{children}</GestorShell>
}
