import { useState, useRef, useEffect } from 'react'
import { Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InfoPopover({ title, steps }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
      >
        <Info size={11} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-8 z-50 w-[340px] bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-brand-100 flex items-center justify-center">
                  <Info size={11} className="text-brand-600" />
                </div>
                <span className="text-xs font-bold text-slate-800">How we get this data</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={11} className="text-slate-400" />
              </button>
            </div>

            {/* Title */}
            <div className="px-4 pt-3 pb-2">
              <div className="text-[13px] font-bold text-slate-900">{title}</div>
            </div>

            {/* Steps */}
            <div className="px-4 pb-4 space-y-2.5">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-brand-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700">{step.source}</div>
                    <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
