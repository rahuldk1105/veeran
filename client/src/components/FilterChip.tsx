'use client'

interface FilterChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  status?: 'success' | 'warning' | 'error' | 'info'
  count?: number
}

export default function FilterChip({ 
  label, 
  active = false, 
  onClick, 
  status,
  count 
}: FilterChipProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-[#54e4a6]'
      case 'warning':
        return 'bg-[#ffbd59]'
      case 'error':
        return 'bg-[#ff5f6d]'
      case 'info':
        return 'bg-[#5ac8fa]'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 border
        ${active 
          ? 'bg-[#54e4a6]/20 text-white border-[#54e4a6]/30 shadow-[0_0_15px_rgba(84,228,166,0.2)]' 
          : 'bg-[#141a21] text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
        }
      `}
    >
      {status && (
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
      )}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-semibold
          ${active 
            ? 'bg-[#54e4a6]/30 text-white' 
            : 'bg-gray-700 text-gray-300'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  )
}