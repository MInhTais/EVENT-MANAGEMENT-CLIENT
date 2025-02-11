import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Share2, Pencil, Trash2 } from 'lucide-react'
import Button from '../../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import eventAPI from '../../api/event.api'
import { formatDate } from '../../utils/utils'
import Modal from '../../components/Modal'
import { eventRegistrationSchema, type Schema } from '../../utils/eventRegistrationSchema'
import { toast } from 'sonner'
import { useMyContext } from '../../context/MyProvider'
import ModalAction from '../../components/EditModal'
import type { Event } from '../../types/event.type'
import { EventActions } from '../../components/EditModal/ModalAction'

type formData = Pick<Schema, 'fullName' | 'email' | 'gender' | 'phoneNumber'>
const registerSchema = eventRegistrationSchema.pick(['fullName', 'email', 'gender', 'phoneNumber'])

export default function EventDetail() {
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { profile, isAuthenticated } = useMyContext()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      gender: 'male'
    }
  })

  useEffect(() => {
    if (isEditModalOpen && editingEvent?.id) {
      eventAPI.getEventDetail(editingEvent.id).then((res) => {
        setEditingEvent(res.data.data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditModalOpen])

  const { data: detailEvent } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventAPI.getEventDetail(id as string)
  })

  const { data: registration } = useQuery({
    queryKey: ['check', id],
    queryFn: () => eventAPI.checkRegistrationEvent({ email: profile?.email as string, eventId: Number(id) })
  })

  const registerParticipationEventMutation = useMutation({
    mutationFn: ({
      id,
      body
    }: {
      id: string
      body: { email: string; eventId: string; fullName: string; gender: string; phoneNumber: string }
    }) => eventAPI.registerParticipationEvent(id, body),
    onSuccess: (data) => {
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['event'] })
      toast.success(data.data.message)
    },
    onError: (error) => {
      console.error('Error during search:', error)
    }
  })

  const handleRegister = () => {
    setIsModalOpen(true)
  }

  const onSubmit = handleSubmit((data) => {
    registerParticipationEventMutation.mutateAsync({ id: id as string, body: { ...data, eventId: id as string } })
    queryClient.invalidateQueries({ queryKey: ['event'] })
  })

  const updateMutation = useMutation({
    mutationFn: (body: EventActions) => eventAPI.updateMyEvent(body),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['event'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response.data.data.password
      toast.error(message)
    }
  })

  const handleUpdateEvent = async (updatedEvent: EventActions) => {
    updateMutation.mutateAsync(updatedEvent)
  }

  const handleEditClick = (event: Event) => {
    setEditingEvent(event)
    setIsEditModalOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: ({ eventId, email }: { eventId: number; email: string }) => eventAPI.deleteMyEvent(eventId, email),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate('/events')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response.data.data.password
      toast.error(message)
    }
  })

  const handleDeleteEvent = async (eventId: number) => {
    deleteMutation.mutateAsync({ eventId, email: profile?.email as string })
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex items-start justify-between mb-8'>
        <h1 className='text-4xl font-bold'>{detailEvent?.data.data.title}</h1>
        <div className='flex gap-2'>
          {profile?.email === detailEvent?.data.data.userEmail && (
            <div className='flex items-center gap-1'>
              <Button onClick={() => handleEditClick(detailEvent?.data.data as Event)}>
                <Pencil className='h-5 w-5 hover:text-green-500' />
              </Button>
              <Button onClick={() => handleEditClick(detailEvent?.data.data as Event)}>
                <Trash2
                  className='h-5 w-5 hover:text-red-500'
                  onClick={() => handleDeleteEvent(detailEvent?.data.data.id as number)}
                />
              </Button>
            </div>
          )}
          {editingEvent && (
            <ModalAction
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              event={editingEvent}
              onUpdate={handleUpdateEvent}
              email={profile?.email as string}
              actionName={'Cập nhật'}
              title='Cập nhật'
            />
          )}
          <Button className='text-red-500'>
            <Share2 className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='flex items-center gap-2 text-gray-600'>
          <Calendar className='h-5 w-5' />
          <span>{formatDate(detailEvent?.data.data.eventDate as string)}</span>
        </div>

        <div className='flex items-center gap-2 text-gray-600'>
          <MapPin className='h-5 w-5' />
          <span>{detailEvent?.data.data.location}</span>
        </div>

        <div className='flex items-center gap-2 text-gray-600'>
          <Users className='h-5 w-5' />
          <div className='flex items-center gap-2'>
            <span>
              {detailEvent?.data.data.currentParticipants} / {detailEvent?.data.data.maxParticipants} người tham gia
            </span>
            <div className='w-48 h-2 bg-gray-200 rounded-full'>
              <div
                className='h-full bg-black rounded-full'
                style={{
                  width: `${((detailEvent?.data.data.currentParticipants ?? 0) / (detailEvent?.data.data.maxParticipants ?? 1)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className='space-y-4 text-gray-600'>{detailEvent?.data.data.content}</div>

        {registration?.data?.data?.email === profile?.email && isAuthenticated === true ? (
          <Button className='w-full sm:w-auto bg-green-900 text-white' disable={true} onClick={handleRegister}>
            Bạn đã đăng kí thành công
          </Button>
        ) : (
          <Button
            className='w-full sm:w-auto bg-black text-white'
            disable={(detailEvent?.data.data.currentParticipants ?? 0) >= (detailEvent?.data.data.maxParticipants ?? 0)}
            onClick={handleRegister}
          >
            {(detailEvent?.data.data.currentParticipants ?? 0) >= (detailEvent?.data.data.maxParticipants ?? 0)
              ? 'Đã đủ người'
              : 'Đăng ký tham gia'}
          </Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size='xl'>
        <h2 className='text-2xl font-bold mb-4'>Đăng ký tham gia sự kiện</h2>
        <p className='mb-4'>Bạn đang đăng ký tham gia sự kiện: {detailEvent?.data.data.title}</p>
        <form className='space-y-4' onSubmit={onSubmit}>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Họ và tên
            </label>
            <input
              type='text'
              id='name'
              className='mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              {...register('fullName')}
            />
          </div>
          <div className='text-red-600 min-h-[1.25rem] text-sm'>{errors.fullName?.message}</div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Giới tính</label>
            <div className='flex space-x-4'>
              <label className='inline-flex items-center'>
                <input type='radio' className='form-radio' value='male' {...register('gender')} />
                <span className='ml-2'>Nam</span>
              </label>
              <label className='inline-flex items-center'>
                <input type='radio' className='form-radio' value='female' {...register('gender')} />
                <span className='ml-2'>Nữ</span>
              </label>
              <label className='inline-flex items-center'>
                <input type='radio' className='form-radio' value='other' {...register('gender')} />
                <span className='ml-2'>Khác</span>
              </label>
            </div>
            {errors.gender && <p className='text-red-500 text-sm'>{errors.gender.message}</p>}
          </div>
          <div className='text-red-600 min-h-[1.25rem] text-sm'>{errors.gender?.message}</div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              {...register('email')}
            />
          </div>
          <div className='text-red-600 min-h-[1.25rem] text-sm'>{errors.email?.message}</div>
          <div>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
              Số điện thoại
            </label>
            <input
              type='tel'
              id='phone'
              className='p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              {...register('phoneNumber')}
            />
          </div>
          <div className='text-red-600 min-h-[1.25rem] text-sm'>{errors.phoneNumber?.message}</div>

          <Button typeButton='submit' className='w-full bg-black text-white'>
            Xác nhận đăng ký
          </Button>
        </form>
      </Modal>
    </div>
  )
}
