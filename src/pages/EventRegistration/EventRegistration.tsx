import { useMyContext } from '../../context/MyProvider'
import { useQuery } from '@tanstack/react-query'
import eventAPI from '../../api/event.api'
import Card from '../../components/Card'
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import { CardContent } from '../../components/Card/Card'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/utils'

export default function EventRegistration() {
  const { profile } = useMyContext()

  const { data: fetchedEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventAPI.registrationEvent({ email: profile?.email || '' })
  })

  console.log(fetchedEvents)

  return (
    <div className='bg-white p-4 rounded-lg shadow mt-4'>
      <div className='flex justify-between items-center mt-6 py-3'>
        <h1 className='text-2xl font-semibold'>Danh sách sự kiện đã đăng kí</h1>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
        {fetchedEvents?.data.data.map((data) => (
          <Card key={data.id} className='p-4 rounded-lg shadow-md hover:shadow-lg relative'>
            {data?.event?.status === 'active' && (
              <div className='absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md'>
                Đã đăng kí
              </div>
            )}
            {data?.event?.status === 'canceled' && (
              <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md'>
                Sự kiện bị hủy
              </div>
            )}
            <CardContent>
              <Link to={`/event/${data.event.id}`}>
                <h2 className='text-lg font-semibold'>{data.event?.title}</h2>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiCalendar /> {formatDate(data.event?.eventDate)}
                </div>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiMapPin /> {data.event?.location}
                </div>
                <div className='flex items-center gap-2 mt-2 text-gray-600'>
                  <FiUsers /> {data.event?.currentParticipants} người tham gia
                </div>
              </Link>
              <div className='h-[1px] w-full bg-gray-300 my-3'></div>
              <div className='flex flex-col justify-center gap-2 mt-2 text-gray-600'>
                <p>Thông tin đăng kí</p>
                <p>Email: {data.email}</p>
                <p>Họ và tên: {data.fullName}</p>
                <p>Giới tính: {data.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                <p>Ngày đăng kí: {formatDate(data.registeredAt)}</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-gray-400 px-3 py-2 rounded-md cursor-not-allowed text-white w-full mt-5'>
                  Đăng kí thành công
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {fetchedEvents?.data.data.length === 0 && <p className='text-base text-black text-center'>Chưa có sự kiện</p>}
    </div>
  )
}
