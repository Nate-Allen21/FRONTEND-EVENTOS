import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Eventos from './pages/Eventos.jsx'
import FormEvento from './pages/FormEvento.jsx'
import DetalheEvento from './pages/DetalheEvento.jsx'
import Participantes from './pages/Participantes.jsx'

function App() {
  return (
    <div>
      <nav>
        <a href="/">Dashboard</a>
        <a href="/eventos">Eventos</a>
        <a href="/eventos/novo">Novo Evento</a>
        <a href="/participantes">Participantes</a>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/novo" element={<FormEvento />} />
          <Route path="/eventos/:id" element={<DetalheEvento />} />
          <Route path="/participantes" element={<Participantes />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
