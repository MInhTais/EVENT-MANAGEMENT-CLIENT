import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from '../Modal'
import { Event } from '../../types/event.type'
import Button from '../Button'

export interface EventActions {
  eventId?: number
  title: string
  content: string
  eventDate: string
  location: string
  maxParticipants: number
}

interface ModalActionProps {
  isOpen: boolean
  onClose: () => void
  event?: Event // Cho phép undefined
  onUpdate: (updatedEvent: EventActions) => void
  email: string
  actionName: string
  title: string
}

const eventSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề không được để trống'),
  content: yup.string().required('Nội dung không được để trống'),
  eventDate: yup.string().required('Ngày tổ chức không hợp lệ'),
  location: yup.string().required('Địa điểm không được để trống'),
  maxParticipants: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Số lượng tối đa là bắt buộc')
    .min(1, 'Số lượng tối thiểu là 1')
})

const ModalAction: React.FC<ModalActionProps> = ({ isOpen, onClose, event, onUpdate, actionName, title }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<EventActions>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: '',
      content: '',
      eventDate: '',
      location: '',
      maxParticipants: 0
    }
  })

  useEffect(() => {
    if (actionName === 'Cập nhật' && event) {
      setValue('eventId', event.id)
      setValue('title', event.title)
      setValue('content', event.content)
      const formattedDate =
        event?.eventDate && !isNaN(Date.parse(event.eventDate))
          ? new Date(event.eventDate).toISOString().slice(0, 16)
          : ''
      setValue('eventDate', formattedDate)
      setValue('location', event.location)
      setValue('maxParticipants', event.maxParticipants)
    } else {
      reset()
    }
  }, [event, actionName, setValue, reset])

  const onSubmit = (data: EventActions) => {
    onUpdate(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
            Tiêu đề
          </label>
          <input {...register('title')} className='border p-2 rounded-md w-full' />
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='content' className='block text-sm font-medium text-gray-700'>
            Nội dung
          </label>
          <textarea {...register('content')} className='border p-2 rounded-md w-full' />
          {errors.content && <p className='text-red-500'>{errors.content.message}</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='eventDate' className='block text-sm font-medium text-gray-700'>
            Ngày tổ chức
          </label>
          <input type='datetime-local' {...register('eventDate')} className='border p-2 rounded-md w-full' />
          {errors.eventDate && <p className='text-red-500'>{errors.eventDate.message}</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='location' className='block text-sm font-medium text-gray-700'>
            Địa điểm
          </label>
          <input {...register('location')} className='border p-2 rounded-md w-full' />
          {errors.location && <p className='text-red-500'>{errors.location.message}</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='maxParticipants' className='block text-sm font-medium text-gray-700'>
            Số lượng tối đa
          </label>
          <input type='number' {...register('maxParticipants')} className='border p-2 rounded-md w-full' />
          {errors.maxParticipants && <p className='text-red-500'>{errors.maxParticipants.message}</p>}
        </div>

        <div className='flex justify-end gap-4'>
          <Button typeButton='submit' className='p-2 bg-green-500 text-white hover:bg-green-600'>
            {actionName}
          </Button>
          <Button typeButton='button' onClick={onClose} className='p-2 bg-red-500 text-white hover:bg-red-600'>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ModalAction
