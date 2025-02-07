import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import { CardContent } from '../../components/Card/Card'
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import { formatDate } from '../../utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import eventAPI from '../../api/event.api'
import { useMyContext } from '../../context/MyProvider'
import type { Event, UpdateEventBody } from '../../types/event.type'
import { toast } from 'sonner'
import { useState } from 'react'
import ModalAction from '../../components/EditModal'
import { EventActions } from '../../components/EditModal/ModalAction'

export default function MyEvent() {
  const { profile } = useMyContext()
  const queryClient = useQueryClient()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event>({} as Event)

  const handleEditClick = async (event: Event) => {
    try {
      const response = await eventAPI.getEventDetail(event.id)
      const detailedEvent = response.data.data
      setEditingEvent(detailedEvent)
      setIsEditModalOpen(true)
    } catch (error) {
      console.error('Error fetching event details:', error)
      toast.error('Failed to fetch event details')
    }
  }

  const { data: fetchedEvents } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => eventAPI.myEvent({ email: profile?.email || '' })
  })

  const updateStatusMutation = useMutation({
    mutationFn: (body: UpdateEventBody) => eventAPI.updateStatusMyEvent(body),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['my-events'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response.data.data.password
      toast.error(message)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (body: EventActions) => eventAPI.updateMyEvent(body),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['my-events'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response.data.data.password
      toast.error(message)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ eventId, email }: { eventId: number; email: string }) => eventAPI.deleteMyEvent(eventId, email),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['my-events'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response.data.data.password
      toast.error(message)
    }
  })

  const handleUpdateStatusEvent = (eventId: number) => {
    updateStatusMutation.mutateAsync({ email: profile?.email as string, eventId })
  }

  const handleUpdateEvent = async (updatedEvent: EventActions) => {
    updateMutation.mutateAsync(updatedEvent)
  }

  const handleDeleteEvent = async (eventId: number) => {
    deleteMutation.mutateAsync({ eventId, email: profile?.email as string })
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow mt-4'>
      <div className='flex justify-between items-center mt-6 py-3'>
        <h1 className='text-2xl font-semibold'>Danh sách sự kiện của tôi</h1>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
        {fetchedEvents?.data.data.map((event) => (
          <Card key={event.id} className='p-4 rounded-lg shadow-md hover:shadow-lg relative'>
            {event.status === 'active' && (
              <div className='absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md'>
                Đang hoạt động
              </div>
            )}
            {event.status === 'canceled' && (
              <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md'>
                Đã hủy
              </div>
            )}
            <CardContent>
              <Link to={`/event/${event.id}`}>
                <h2 className='text-lg font-semibold'>{event.title}</h2>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiCalendar /> {formatDate(event.eventDate)}
                </div>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiMapPin /> {event.location}
                </div>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiUsers /> {event.currentParticipants} người tham gia
                </div>
              </Link>
              <div className='mt-3 flex items-center'>
                <Button
                  className={`py-1.5 text-white ${event.status === 'canceled' ? 'bg-green-500' : 'bg-gray-400'}`}
                  onClick={() => handleUpdateStatusEvent(event.id)}
                >
                  {event.status === 'canceled' ? 'Hoạt động' : 'Hủy sự kiện'}
                </Button>
                <Button className='bg-blue-500 text-white py-1.5 ml-2' onClick={() => handleEditClick(event)}>
                  Chỉnh sửa
                </Button>

                <Button className='bg-red-500 text-white py-1.5 ml-2' onClick={() => handleDeleteEvent(event.id)}>
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {fetchedEvents?.data.data.length === 0 && <p className='text-base text-black text-center'>Chưa có sự kiện</p>}

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
    </div>
  )
}
