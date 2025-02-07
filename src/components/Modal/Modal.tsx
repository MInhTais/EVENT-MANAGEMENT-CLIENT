// components/Modal.tsx
import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className={`bg-white rounded-lg shadow-lg relative w-full ${sizeClasses[size]}`}>
        <button onClick={onClose} className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'>
          <X size={24} className='cursor-pointer' />
        </button>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
