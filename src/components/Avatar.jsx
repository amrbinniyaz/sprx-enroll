import { initials, avatarGradient, cn } from '../lib/utils'

export default function Avatar({ name, size = 'w-9 h-9 text-sm' }) {
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
