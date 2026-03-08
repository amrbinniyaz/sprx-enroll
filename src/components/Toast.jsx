import { useEffect } from 'react'
import { Check, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 anim-toast">
      <div className="bg-slate-900 text-white pl-4 pr-3 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
        <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Check size={12} className="text-white" />
        </span>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
