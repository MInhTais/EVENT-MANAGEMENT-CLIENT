import { useState } from 'react'
import { FiPlus, FiMapPin, FiUsers, FiCalendar, FiX } from 'react-icons/fi'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Card from '../../components/Card'
import { CardContent } from '../../components/Card/Card'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import eventAPI from '../../api/event.api'
import { formatDate } from '../../utils/utils'
import { Event } from '../../types/event.type'
import ModalAction from '../../components/EditModal'
import { useMyContext } from '../../context/MyProvider'
import { toast } from 'sonner'
import { EventActions } from '../../components/EditModal/ModalAction'
import Login from '../../layout/MainLayout/components/Login'

export default function HomePage() {
  const [searchData, setSearchData] = useState<Event[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const { profile, isAuthenticated } = useMyContext()

  const queryClient = useQueryClient()

  const { data: fetchedEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventAPI.getAllEvent()
  })

  const searchMutation = useMutation({
    mutationFn: (body: { title: string }) => eventAPI.searchEvent(body),
    onSuccess: (data) => {
      setSearchData(data.data.data || [])
      setIsSearching(true)
    },
    onError: (error) => {
      console.error('Error during search:', error)
      setIsSearching(false)
    }
  })

  const createMutation = useMutation({
    mutationFn: (body: {
      content: string
      createdByName: string
      eventDate: string
      location: string
      maxParticipants: number
      title: string
      userEmail: string
    }) => eventAPI.createEvent(body),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (error) => {
      console.error('Error during search:', error)
    }
  })

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      searchMutation.mutate({ title: searchKeyword })
    } else {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchKeyword('')
    setIsSearching(false)
    queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  const eventsToDisplay = isSearching ? searchData : fetchedEvents?.data.data || []

  const handleCreateEvent = (data: EventActions) => {
    createMutation.mutateAsync({
      content: data?.content as string,
      createdByName: profile?.fullName as string,
      eventDate: data.eventDate as string,
      location: data.location as string,
      maxParticipants: Number(data.maxParticipants),
      title: data.title as string,
      userEmail: profile?.email as string
    })
  }

  return (
    <div>
      <div className='bg-white p-4 rounded-lg shadow mt-4'>
        <div className='flex justify-between items-center mt-6 py-3'>
          <h1 className='text-2xl font-semibold'>Tìm kiếm</h1>
        </div>
        <div className='flex gap-4 mt-2 relative'>
          <Input
            placeholder='Nhập từ khóa tìm kiếm sự kiện...'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className='pr-10'
          />
          {searchKeyword && (
            <button
              className='absolute right-[120px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              onClick={handleClearSearch}
            >
              <FiX size={20} className='cursor-pointer' />
            </button>
          )}
          <Button className='bg-black text-white' onClick={handleSearch}>
            Tìm
          </Button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg shadow mt-4'>
        <div className='flex justify-between items-center mt-6 py-3'>
          <h1 className='text-2xl font-semibold'>{isSearching ? 'Kết quả tìm kiếm' : 'Danh sách sự kiện'}</h1>
          <Button
            className='bg-black text-white flex items-center gap-2'
            onClick={() => (isAuthenticated ? setIsCreateModalOpen(true) : setIsLoginOpen(true))}
          >
            <FiPlus /> Thêm mới
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          {eventsToDisplay.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id}>
              <Card className='p-4 rounded-lg shadow-md hover:shadow-lg'>
                <CardContent>
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {eventsToDisplay.length === 0 && (
        <div className='text-center mt-6'>
          <p>Không có sự kiện nào được tìm thấy.</p>
        </div>
      )}

      {isCreateModalOpen && (
        <ModalAction
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          event={undefined}
          onUpdate={handleCreateEvent}
          email={profile?.email as string}
          actionName={'Thêm sự kiện'}
          title='Thêm sự kiện'
        />
      )}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    </div>
  )
}
