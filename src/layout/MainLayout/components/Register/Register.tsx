import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import { eventRegistrationSchema, Schema } from '../../../../utils/eventRegistrationSchema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import authAPI from '../../../../api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import React from 'react'

type formData = Pick<Schema, 'password' | 'email' | 'confirmPassword' | 'fullName'>
const registerSchema = eventRegistrationSchema.pick(['password', 'email', 'confirmPassword', 'fullName'])

const Register: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: { email: string; password: string; fullName: string }) => authAPI.register(body),
    onSuccess: (message) => {
      toast.success(message.data.message)
      onClose()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đăng kí thất bại'
      toast.error(message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutateAsync(data)
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <h2 className='text-xl font-bold mb-4'>Đăng kí</h2>
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <input
          type='email'
          placeholder='Nhập vào email'
          {...register('email')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.email?.message}</div>
        <input
          type='text'
          placeholder='Nhập vào họ và tên'
          {...register('fullName')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.fullName?.message}</div>
        <input
          type='password'
          placeholder='Nhập vào mật khẩu'
          {...register('password')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.password?.message}</div>
        <input
          type='password'
          placeholder='Nhập vào mật khẩu'
          {...register('confirmPassword')}
          className='py-3 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
        <div className='text-red-600 text-sm'>{errors.confirmPassword?.message}</div>
        <Button typeButton='submit' className='bg-blue-500 text-white w-full'>
          Đăng kí
        </Button>
      </form>
    </Modal>
  )
}

export default Register
