import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get, post } from '../services/api'

export default function DetalheEvento() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [inscritos, setInscritos] = useState([])
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
      setNome('')
      setEmail('')
      setCpf('')
      carregar()
    } catch (err) {
      setErro(err?.message || 'Não foi possível realizar a inscrição.')
    }
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
        <thead><tr><th>Participante</th><th>Data inscricao</th><th>Status</th></tr></thead>
        <tbody>
          {inscritos.map((i) => (
            <tr key={i.id}>
              <td>{i.participanteId}</td>
              <td>{i.dataInscricao}</td>
              <td>{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
