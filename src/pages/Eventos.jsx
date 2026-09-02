import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../services/api'

export default function Eventos() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    get('/eventos').then(setEventos)
  }, [])

  return (
    <div>
      <h1>Eventos</h1>
      <div className="grid">
        {eventos.map((e) => {
          // BUG: repete a mesma conta com off-by-one que existe no backend
          // (vagasTotais - vagasOcupadas - 1), reforcando o erro visualmente
          const vagasRestantes = e.vagasTotais - e.vagasOcupadas - 1

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
