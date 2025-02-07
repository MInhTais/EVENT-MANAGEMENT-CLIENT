import { createRoot } from 'react-dom/client'
import './index.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MyProvider } from './context/MyProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MyProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </MyProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
