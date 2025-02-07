import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import { eventRegistrationSchema, Schema } from '../../../../utils/eventRegistrationSchema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import authAPI from '../../../../api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMyContext } from '../../../../context/MyProvider'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type formData = Pick<Schema, 'password' | 'email'>
const loginSchema = eventRegistrationSchema.pick(['password', 'email'])

const Login: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setIsAuthenticated, setProfile } = useMyContext()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClose = () => {
    if (location.pathname === '/') {
      onClose()
    } else {
      navigate('/')
      onClose()
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'minhtai2019cb2@gmail.com',
      password: 'minhtai12345'
    }
  })

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => authAPI.login(body),
    onSuccess: (res) => {
      toast.success(res.data.message)
      onClose()
      setProfile(res.data.data.user)
      setIsAuthenticated(true)

      if (location.pathname !== '/') {
        window.location.reload()
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      toast.error(message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutateAsync(data)
  })

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='md'>
      <h2 className='text-xl font-bold mb-4'>Đăng nhập</h2>
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.email?.message}</div>
        <input
          type='password'
          placeholder='Mật khẩu'
          {...register('password')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.password?.message}</div>
        <Button typeButton='submit' className='bg-blue-500 text-white w-full'>
          Đăng nhập
        </Button>
      </form>
    </Modal>
  )
}

export default Login
