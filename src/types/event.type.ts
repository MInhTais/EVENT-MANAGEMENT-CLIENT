export interface Event {
  id: number
  title: string
  content: string
  eventDate: string
  location: string
  currentParticipants: number | null
  maxParticipants: number
  status: 'pending' | 'active' | 'canceled'
  createdByName: string
  userEmail: string
}

export type UpdateEventBody = Partial<Event> & {
  eventId: number
  email: string
}

export type CreateEventBody = Partial<Omit<Event, 'eventId'>> & {
  eventId: number
  email: string
}

export interface EventRegistration {
  id: number
  eventId: number
  fullName: string
  gender: string
  email: string
  phoneNumber: string
  registeredAt: string
  event: Event
}

export interface EventDetail {
  id: number
  title: string
  content: string
  eventDate: string
  location: string
  currentParticipants: number | null
  maxParticipants: number
  status: 'pending' | 'active' | 'canceled'
  createdByName: string
  userEmail: string
}
