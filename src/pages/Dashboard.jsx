import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Dashboard() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    get('/eventos').then(setEventos)
  }, [])

  const totalEventos = eventos.length
  const totalVagasOcupadas = eventos.reduce((acc, e) => acc + (e.vagasOcupadas || 0), 0)

  return (
    <div>
      <h1>Painel de Eventos</h1>
      <div className="grid">
        <div className="card"><div>Eventos cadastrados</div><div className="stat">{totalEventos}</div></div>
        <div className="card"><div>Total de inscricoes</div><div className="stat">{totalVagasOcupadas}</div></div>
      </div>

      <h2>Proximos eventos</h2>
      <table>
        <thead><tr><th>Evento</th><th>Data</th><th>Local</th><th>Vagas</th></tr></thead>
        <tbody>
          {/* BUG: nao ordena os eventos por data, aparecem na ordem em que
              foram cadastrados no banco em vez de ordem cronologica */}
          {eventos.map((e) => (
            <tr key={e.id}>
              <td>{e.nome}</td>
              {/* BUG: data crua sem formatacao em pt-BR */}
              <td>{new Date(e.dataEvento).toString()}</td>
              <td>{e.local}</td>
              <td>{e.vagasOcupadas}/{e.vagasTotais}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
