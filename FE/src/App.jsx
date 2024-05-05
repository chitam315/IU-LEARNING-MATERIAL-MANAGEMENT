import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import './pages/element.scss'

function App() {
  const element = useRoutes(routes)

  return (
    element
  )
}

export default App