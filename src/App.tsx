import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Connexion from './pages/Connexion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </BrowserRouter>
  )
}
