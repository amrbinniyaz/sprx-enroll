import { useState } from 'react'
import { initials, avatarGradient, cn } from '../lib/utils'

function avatarUrl(name, px = 128) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&size=${px}&backgroundColor=transparent`
}

export default function Avatar({ name, size = 'w-9 h-9 text-sm' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          size,
          'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold flex-shrink-0',
          avatarGradient(name)
        )}
      >
        {initials(name)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        size,
        'rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-brand-50 to-pink-50 border border-slate-100/60'
      )}
    >
      <img
        src={avatarUrl(name)}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
