import useRouteElement from './useRouteElement'
import { Toaster } from 'sonner'

export default function App() {
  const routeElements = useRouteElement()

  return (
    <>
      <Toaster />
      {routeElements}
    </>
  )
}
