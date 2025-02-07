'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Login from './components/Login'
import { useMyContext } from '../../context/MyProvider'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'
import { toast } from 'sonner'
import Button from '../../components/Button'
import Register from './components/Register'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const { isAuthenticated, profile, logout } = useMyContext()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisternOpen, setIsRegisternOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    setLogoutModalOpen(false)
    toast.success('Đăng xuất thành công')
    navigate('/')
  }

  const ProfileDisplay = () => (
    <p className='text-white hover:text-gray-300 cursor-pointer' onClick={() => setLogoutModalOpen(true)}>
      Xin chào: {profile?.fullName}
    </p>
  )

  const NavLinks = () => (
    <>
      <Link to='/' className='text-white hover:text-gray-300'>
        Trang chủ
      </Link>
      <Link to='/my-event' className='text-white hover:text-gray-300'>
        Sự kiện của tôi
      </Link>
      <Link to='/registration-event' className='text-white hover:text-gray-300'>
        Sự kiện đã đăng kí
      </Link>
    </>
  )

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <header className='bg-black p-4 text-xl font-bold flex justify-between items-center relative'>
        <span className='text-white'>Event Manager</span>
        <div className='md:hidden'>
          <FiMenu className='text-white text-2xl' onClick={() => setMenuOpen(true)} />
        </div>
        <nav className='hidden md:flex gap-4 text-sm items-center'>
          {isAuthenticated && <NavLinks />}
          {isAuthenticated ? (
            <ProfileDisplay />
          ) : (
            <div className='flex items-center gap-5'>
              <Button className='bg-white text-black' onClick={() => setIsLoginOpen(true)}>
                Đăng nhập
              </Button>
              <Button className='bg-white text-black' onClick={() => setIsRegisternOpen(true)}>
                Đăng kí
              </Button>
            </div>
          )}
        </nav>
      </header>

      <div
        className={`fixed inset-0 bg-black bg-opacity-75 flex flex-col p-6 text-white w-64 z-50 transform transition-transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <FiX className='text-2xl self-end cursor-pointer' onClick={() => setMenuOpen(false)} />
        {isAuthenticated ? (
          <>
            <NavLinks />
            <ProfileDisplay />
          </>
        ) : (
          <div className='flex items-center gap-5'>
            <Button className='bg-white text-black' onClick={() => setIsLoginOpen(true)}>
              Đăng nhập
            </Button>
            <Button className='bg-white text-black' onClick={() => setIsRegisternOpen(true)}>
              Đăng kí
            </Button>
          </div>
        )}
      </div>

      {children}

      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} size='sm'>
        <div className='text-center'>
          <h2 className='text-xl font-bold mb-4'>Xác nhận đăng xuất</h2>
          <p className='mb-6'>Bạn có chắc chắn muốn đăng xuất không?</p>
          <div className='flex justify-center gap-4'>
            <button
              onClick={handleLogout}
              className='bg-red-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-red-600'
            >
              Đăng xuất
            </button>
            <button
              onClick={() => setLogoutModalOpen(false)}
              className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer'
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
      {isRegisternOpen && <Register isOpen={isRegisternOpen} onClose={() => setIsRegisternOpen(false)} />}
    </div>
  )
}
