import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Mostrador from './pages/Mostrador.jsx'
import Cocina from './pages/Cocina.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/mostrador" element={<Mostrador />} />
      <Route path="/cocina" element={<Cocina />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
