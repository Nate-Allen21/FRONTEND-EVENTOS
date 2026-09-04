import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Eventos from './pages/Eventos.jsx'
import FormEvento from './pages/FormEvento.jsx'
import DetalheEvento from './pages/DetalheEvento.jsx'
import Participantes from './pages/Participantes.jsx'
import Login from './pages/Login.jsx'

function App() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(() => {
    try {
      const item = localStorage.getItem('eventos-user')
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!usuario) {
      navigate('/login')
    }
  }, [usuario, navigate])

  function logout() {
    localStorage.removeItem('eventos-user')
    setUsuario(null)
    navigate('/login')
  }

  const autenticado = Boolean(usuario)

  return (
    <div>
      <nav>
        {autenticado ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/eventos/novo">Novo Evento</Link>
            <Link to="/participantes">Participantes</Link>
            <span style={{ marginLeft: 'auto', color: '#fff', fontWeight: 600 }}>
              {usuario?.nome || 'Usuário'}
            </span>
            <button className="secondary" onClick={logout}>Sair</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={setUsuario} />} />
          <Route path="/" element={autenticado ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/eventos" element={autenticado ? <Eventos /> : <Navigate to="/login" replace />} />
          <Route path="/eventos/novo" element={autenticado ? <FormEvento /> : <Navigate to="/login" replace />} />
          <Route path="/eventos/:id" element={autenticado ? <DetalheEvento /> : <Navigate to="/login" replace />} />
          <Route path="/participantes" element={autenticado ? <Participantes /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={autenticado ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
