import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Connexion from './pages/Connexion'
import AppShell from './app/AppShell'
import GalaxyMap from './app/GalaxyMap'
import LessonPlayer from './app/LessonPlayer'
import StudioLibre from './app/StudioLibre'
import Parents from './app/Parents'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<GalaxyMap />} />
          <Route path="lecon/:id" element={<LessonPlayer />} />
          <Route path="studio" element={<StudioLibre />} />
          <Route path="parents" element={<Parents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
