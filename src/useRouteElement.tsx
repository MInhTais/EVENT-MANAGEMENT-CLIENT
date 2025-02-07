import { useLocation, useRoutes } from 'react-router-dom'
import Login from './layout/MainLayout/components/Login'
import { useMyContext } from './context/MyProvider'
import { useEffect, useState } from 'react'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/Home'
import MyEvent from './pages/MyEvent'
import EventRegistration from './pages/EventRegistration'
import EventDetail from './pages/EventDetail'

export default function useRouteElement() {
  const { isAuthenticated } = useMyContext()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated && ['/my-event', '/registration-event'].includes(location.pathname)) {
      setIsLoginOpen(true)
    }
  }, [location.pathname, isAuthenticated])

  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )
    },
    {
      path: '/my-event',
      element: isAuthenticated ? (
        <MainLayout>
          <MyEvent />
        </MainLayout>
      ) : null
    },
    {
      path: '/registration-event',
      element: isAuthenticated ? (
        <MainLayout>
          <EventRegistration />
        </MainLayout>
      ) : null
    },
    {
      path: '/event/:id',
      element: (
        <MainLayout>
          <EventDetail />
        </MainLayout>
      )
    }
  ])

  return (
    <>
      {routeElements}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
