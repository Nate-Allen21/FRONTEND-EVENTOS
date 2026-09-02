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

  useEffect(() => {
    carregar()
  }, [id])

  function carregar() {
    get(`/eventos/${id}`).then(setEvento)
    get(`/inscricoes?eventoId=${id}`).then(setInscritos)
  }

  async function inscrever(e) {
    e.preventDefault()
    // BUG: nao verifica se esse participante (por nome/email) ja esta
    // inscrito nesse evento antes de criar o participante e a inscricao,
    // permitindo inscricoes duplicadas da mesma pessoa.
    const participante = await post('/participantes', { nome, email, cpf })
    await post('/inscricoes', { eventoId: Number(id), participanteId: participante.id })
    setNome('')
    setEmail('')
    setCpf('')
    // BUG: a lista de inscritos do evento nao e recarregada apos a nova
    // inscricao (falta chamar carregar() aqui), entao o participante recem
    // inscrito nao aparece na tela ate a pagina ser recarregada manualmente.
  }

  if (!evento) return <p>Carregando...</p>

  const vagasRestantes = evento.vagasTotais - evento.vagasOcupadas - 1
  // BUG: o botao de inscricao continua habilitado mesmo quando nao ha mais
  // vagas (deveria ficar desabilitado quando vagasRestantes <= 0)
  const semVagas = false

  return (
    <div>
      <h1>{evento.nome}</h1>
      <p>{evento.descricao}</p>
      <p>Local: {evento.local}</p>
      <p>Vagas restantes: {vagasRestantes}</p>

      <form className="card" onSubmit={inscrever}>
        <h3>Inscrever participante</h3>
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
