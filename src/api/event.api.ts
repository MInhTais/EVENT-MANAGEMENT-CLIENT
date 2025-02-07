import { EventActions } from '../components/EditModal/ModalAction'
import { Event, EventRegistration, UpdateEventBody } from '../types/event.type'
import { SuccessResponse } from '../types/untils.type'
import http from '../utils/http'

const eventAPI = {
  getAllEvent() {
    return http.get<SuccessResponse<Event[]>>(`${'/events'}`)
  },
  getEventDetail(id: string | number) {
    return http.get<SuccessResponse<Event>>(`${'/events/'}${id}`)
  },
  searchEvent(body: { title: string }) {
    return http.post<SuccessResponse<Event[]>>(`${'/events/search'}`, body)
  },
  registerParticipationEvent(
    id: string,
    body: { email: string; eventId: string; fullName: string; gender: string; phoneNumber: string }
  ) {
    return http.post<SuccessResponse<string>>(`/events/${id}/register`, body)
  },
  myEvent(body: { email: string }) {
    return http.post<SuccessResponse<Event[]>>(`${'/events/my-events'}`, body)
  },
  updateStatusMyEvent(body: UpdateEventBody) {
    return http.post<SuccessResponse<string>>(`${'/events/update-status'}`, body)
  },
  updateMyEvent(body: EventActions) {
    return http.put<SuccessResponse<string>>(`${'/events/update-event'}`, body)
  },
  deleteMyEvent(eventId: number, email: string) {
    return http.delete<SuccessResponse<void>>(
      `/events/delete-event?eventId=${eventId}&email=${encodeURIComponent(email)}`
    )
  },
  registrationEvent(body: { email: string }) {
    return http.post<SuccessResponse<EventRegistration[]>>(`${'/events/registration-events'}`, body)
  },
  checkRegistrationEvent(body: { email: string, eventId: number }) {
    return http.post<SuccessResponse<EventRegistration>>(`${'/events/check-registration'}`, body)
  },
  createEvent(body: {
    content: string
    createdByName: string
    eventDate: string
    location: string
    maxParticipants: number
    title: string
    userEmail: string
  }) {
    return http.post<SuccessResponse<void>>(`${'/events'}`, body)
  }
}
export default eventAPI
