import { useEffect, useState } from 'react'
import { get, put } from '../services/api'

export default function CheckInPage({ onNotify }) {
  const [eventos, setEventos] = useState([])
  const [eventoId, setEventoId] = useState('')
  const [inscricoes, setInscricoes] = useState([])
  const [participantes, setParticipantes] = useState([])

  useEffect(() => {
    get('/eventos').then(setEventos)
    get('/participantes').then(setParticipantes)
  }, [])

  useEffect(() => {
    if (!eventoId) {
      setInscricoes([])
      return
    }

    get(`/inscricoes?eventoId=${eventoId}`).then(setInscricoes)
  }, [eventoId])

  async function marcarPresenca(id) {
    try {
      await put(`/inscricoes/${id}/checkin`)
      const lista = await get(`/inscricoes?eventoId=${eventoId}`)
      setInscricoes(lista)
      onNotify?.('Check-in realizado com sucesso.')
    } catch (err) {
      onNotify?.(err.message || 'Não foi possível registrar a presença.')
    }
  }

  return (
    <div>
      <h1>Check-in</h1>

      <div className="card">
        <label>Evento</label>
        <select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
          <option value="">Selecione um evento</option>
          {eventos.map((evento) => (
            <option key={evento.id} value={evento.id}>{evento.nome}</option>
          ))}
        </select>
      </div>

      {eventoId && (
        <table>
          <thead>
            <tr>
              <th>Participante</th>
              <th>Status</th>
              <th>Presença</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map((item) => {
              const participante = participantes.find((p) => p.id === item.participanteId)
              return (
                <tr key={item.id}>
                  <td>{participante?.nome || `Participante ${item.participanteId}`}</td>
                  <td>{item.status}</td>
                  <td>
                    <button type="button" disabled={item.status === 'PRESENTE'} onClick={() => marcarPresenca(item.id)}>
                      {item.status === 'PRESENTE' ? 'Presente' : 'Marcar presença'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
