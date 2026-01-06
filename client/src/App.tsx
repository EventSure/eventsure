import { AppProvider } from '@/providers/AppProvider'
import { Router } from '@/router'

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}

export default App
