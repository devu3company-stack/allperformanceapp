import { QrCode, MapPin, CheckCircle } from 'lucide-react'

export default function CheckinPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 sm:space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-display uppercase tracking-wider sm:text-2xl">Faça seu Check-in</h2>
        <p className="text-gray-400 text-sm">Aproxime o QR Code do leitor da catraca</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-xl shadow-ap-red/10 sm:p-6">
        {/* Placeholder for real QR code */}
        <div className="flex h-52 w-52 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 sm:h-64 sm:w-64">
          <QrCode size={96} className="text-ap-black opacity-80 sm:h-[120px] sm:w-[120px]" />
        </div>
      </div>

      <div className="flex w-full max-w-sm items-center justify-between rounded-xl border border-white/10 bg-ap-charcoal p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-12 h-12 bg-ap-black rounded-lg flex items-center justify-center text-ap-red">
            <MapPin size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">ALL Performance</p>
            <p className="text-xs text-gray-400">Unidade Principal</p>
          </div>
        </div>
        <div className="text-ap-red">
          <CheckCircle size={24} />
        </div>
      </div>

      <form className="w-full max-w-sm" action={async () => {
        'use server'
        // Logic for manual check-in
      }}>
        <button type="submit" className="w-full rounded-xl bg-ap-red px-8 py-4 font-bold text-white shadow-lg transition-colors hover:bg-ap-redDark">
          Fazer Check-in Manual
        </button>
      </form>
    </div>
  )
}
