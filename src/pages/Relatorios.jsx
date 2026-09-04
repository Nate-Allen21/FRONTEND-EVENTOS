import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Relatorios() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    async function carregar() {
      const lista = await get('/eventos')
      const detalhado = await Promise.all(
        lista.map(async (evento) => {
          const inscricoes = await get(`/inscricoes?eventoId=${evento.id}`)
          return {
            ...evento,
            totalInscritos: inscricoes.length,
            presentes: inscricoes.filter((item) => item.status === 'PRESENTE').length,
          }
        }),
      )
      setEventos(detalhado)
    }

    carregar()
  }, [])

  const totalEventos = eventos.length
  const totalInscritos = eventos.reduce((acc, evento) => acc + (evento.totalInscritos || 0), 0)
  const totalPresentes = eventos.reduce((acc, evento) => acc + (evento.presentes || 0), 0)
  const eventoMaisPopular = eventos.reduce((mais, evento) => {
    if (!mais || (evento.totalInscritos || 0) > (mais.totalInscritos || 0)) {
      return evento
    }
    return mais
  }, null)

  return (
    <div>
      <h1>Relatórios</h1>

      <div className="grid">
        <div className="card">
          <div>Eventos cadastrados</div>
          <div className="stat">{totalEventos}</div>
        </div>
        <div className="card">
          <div>Total de inscrições</div>
          <div className="stat">{totalInscritos}</div>
        </div>
        <div className="card">
          <div>Participantes presentes</div>
          <div className="stat">{totalPresentes}</div>
        </div>
        <div className="card">
          <div>Mais popular</div>
          <div className="stat">{eventoMaisPopular ? eventoMaisPopular.nome : '-'}</div>
        </div>
      </div>

      <div className="card">
        <h3>Resumo por evento</h3>
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Vagas</th>
              <th>Inscritos</th>
              <th>Presentes</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.nome}</td>
                <td>{evento.vagasTotais || 0}</td>
                <td>{evento.totalInscritos || 0}</td>
                <td>{evento.presentes || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
