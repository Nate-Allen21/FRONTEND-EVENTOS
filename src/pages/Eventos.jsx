import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../services/api'

export default function Eventos() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    get('/eventos').then((lista) => {
      const ordenados = [...lista].sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento))
      setEventos(ordenados)
    })
  }, [])

  return (
    <div>
      <h1>Eventos</h1>
      <div className="grid">
        {eventos.map((e) => {
          const vagasRestantes = Math.max((e.vagasTotais || 0) - (e.vagasOcupadas || 0), 0)

          return (
            <div className="card" key={e.id}>
              <h3>{e.nome}</h3>
              <p>{e.local}</p>
              <p>Vagas restantes: {vagasRestantes}</p>
              <Link to={`/eventos/${e.id}`}><button>Ver detalhes / Inscrever</button></Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
