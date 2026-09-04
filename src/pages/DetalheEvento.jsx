import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get, post } from '../services/api'

export default function DetalheEvento({ onNotify }) {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [inscritos, setInscritos] = useState([])
  const [participantes, setParticipantes] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregar()
  }, [id])

  function carregar() {
    get(`/eventos/${id}`).then(setEvento)
    get(`/inscricoes?eventoId=${id}`).then(setInscritos)
    get('/participantes').then(setParticipantes)
  }

  async function inscrever(e) {
    e.preventDefault()
    setErro('')

    const vagasRestantes = Math.max((evento?.vagasTotais || 0) - (evento?.vagasOcupadas || 0), 0)
    if (vagasRestantes <= 0) {
      setErro('Não há vagas disponíveis para este evento.')
      return
    }

    try {
      const participante = await post('/participantes', { nome, email, cpf })
      await post('/inscricoes', { eventoId: Number(id), participanteId: participante.id })
      onNotify?.(`Inscrição confirmada para ${nome}.`)
      setNome('')
      setEmail('')
      setCpf('')
      carregar()
    } catch (err) {
      setErro(err?.message || 'Não foi possível realizar a inscrição.')
    }
  }

  function gerarCertificado(participanteId) {
    const participante = participantes.find((p) => p.id === participanteId)
    const nomeParticipante = participante?.nome || `Participante ${participanteId}`
    const html = `
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>Certificado de Participação</h1>
          <p>Certificamos que</p>
          <h2>${nomeParticipante}</h2>
          <p>participou do evento</p>
          <h3>${evento?.nome}</h3>
          <p>realizado em ${new Date(evento?.dataEvento).toLocaleString('pt-BR')}.</p>
        </body>
      </html>
    `
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificado-${evento?.nome || 'evento'}.html`
    a.click()
    URL.revokeObjectURL(url)
    onNotify?.(`Certificado gerado para ${nomeParticipante}.`)
  }

  if (!evento) return <p>Carregando...</p>

  const vagasRestantes = Math.max((evento.vagasTotais || 0) - (evento.vagasOcupadas || 0), 0)
  const semVagas = vagasRestantes <= 0

  return (
    <div>
      <h1>{evento.nome}</h1>
      <p>{evento.descricao}</p>
      <p>Local: {evento.local}</p>
      <p>Vagas restantes: {vagasRestantes}</p>

      <form className="card" onSubmit={inscrever}>
        <h3>Inscrever participante</h3>
        {erro && <p style={{ color: 'crimson' }}>{erro}</p>}
        <div className="field">
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>CPF</label>
          <input value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </div>
        <button type="submit" disabled={semVagas}>Inscrever-se</button>
      </form>

      <h3>Inscritos</h3>
      <table>
        <thead><tr><th>Participante</th><th>Data inscrição</th><th>Status</th><th>Certificado</th></tr></thead>
        <tbody>
          {inscritos.map((i) => {
            const p = participantes.find((item) => item.id === i.participanteId)
            return (
              <tr key={i.id}>
                <td>{p?.nome || i.participanteId}</td>
                <td>{i.dataInscricao ? new Date(i.dataInscricao).toLocaleString('pt-BR') : '-'}</td>
                <td>{i.status}</td>
                <td>
                  <button type="button" onClick={() => gerarCertificado(i.participanteId)}>Gerar</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
