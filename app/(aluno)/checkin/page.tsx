import { QrCode, MapPin, CheckCircle } from 'lucide-react'

export default function CheckinPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display uppercase tracking-wider">Faça seu Check-in</h2>
        <p className="text-gray-400 text-sm">Aproxime o QR Code do leitor da catraca</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-ap-red/10">
        {/* Placeholder for real QR code */}
        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
          <QrCode size={120} className="text-ap-black opacity-80" />
        </div>
      </div>

      <div className="w-full max-w-sm bg-ap-charcoal p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-ap-black rounded-lg flex items-center justify-center text-ap-red">
            <MapPin size={24} />
          </div>
          <div>
            <p className="font-medium">ALL Performance</p>
            <p className="text-xs text-gray-400">Unidade Principal</p>
          </div>
        </div>
        <div className="text-ap-red">
          <CheckCircle size={24} />
        </div>
      </div>

      <form action={async () => {
        'use server'
        // Logic for manual check-in
      }}>
        <button type="submit" className="w-full py-4 px-8 bg-ap-red hover:bg-ap-redDark text-white font-bold rounded-xl shadow-lg transition-colors">
          Fazer Check-in Manual
        </button>
      </form>
    </div>
  )
}
