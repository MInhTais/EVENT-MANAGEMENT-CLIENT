import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  disable?: boolean
  onClick?: () => void
  typeButton?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export function Button({ children, className = '', disable, onClick, typeButton = 'button' }: ButtonProps) {
  return (
    <button
      disabled={disable}
      type={typeButton}
      className={`px-4 py-2 rounded-md ${disable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
