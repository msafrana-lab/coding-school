import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Connexion from './pages/Connexion'
import AppShell from './app/AppShell'
import GalaxyMap from './app/GalaxyMap'
import Parents from './app/Parents'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<GalaxyMap />} />
          <Route path="parents" element={<Parents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
