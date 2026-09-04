import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../services/api'

export default function Eventos() {
  const [eventos, setEventos] = useState([])
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')

  useEffect(() => {
    get('/eventos').then((lista) => {
      const ordenados = [...lista].sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento))
      setEventos(ordenados)
    })
  }, [])

  const eventosFiltrados = eventos.filter((e) => {
    const nome = e.nome?.toLowerCase() || ''
    const local = e.local?.toLowerCase() || ''
    const buscaOk = nome.includes(busca.toLowerCase()) || local.includes(busca.toLowerCase())

    const dataEvento = new Date(e.dataEvento)
    const status = dataEvento < new Date() ? 'realizado' : 'proximo'
    const statusOk = statusFiltro === 'todos' || status === statusFiltro

    return buscaOk && statusOk
  })

  return (
    <div>
      <h1>Eventos</h1>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou local"
        />
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="proximo">Próximos</option>
          <option value="realizado">Realizados</option>
        </select>
      </div>

      <div className="grid">
        {eventosFiltrados.map((e) => {
          const vagasRestantes = Math.max((e.vagasTotais || 0) - (e.vagasOcupadas || 0), 0)
          const status = new Date(e.dataEvento) < new Date() ? 'Realizado' : 'Próximo'

          return (
            <div className="card" key={e.id}>
              <h3>{e.nome}</h3>
              <p>{e.local}</p>
              <p>{new Date(e.dataEvento).toLocaleString('pt-BR')}</p>
              <p>Status: {status}</p>
              <p>Vagas restantes: {vagasRestantes}</p>
              <Link to={`/eventos/${e.id}`}><button>Ver detalhes / Inscrever</button></Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
