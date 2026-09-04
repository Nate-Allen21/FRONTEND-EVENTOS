import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/api'

export default function FormEvento() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', descricao: '', dataEvento: '', local: '', vagasTotais: 10 })
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.local || !form.dataEvento || !form.vagasTotais) {
      setErro('Preencha nome, local, data e quantidade de vagas.')
      return
    }

    try {
      await post('/eventos', {
        ...form,
        vagasTotais: Number(form.vagasTotais),
      })
      navigate('/eventos')
    } catch (err) {
      setErro(err.message || 'Não foi possível cadastrar o evento.')
    }
  }

  return (
    <div>
      <h1>Novo Evento</h1>
      <form className="card" onSubmit={handleSubmit}>
        {erro && <p style={{ color: 'crimson', marginBottom: 12 }}>{erro}</p>}
        <div className="field">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Descricao</label>
          <input name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Data e hora</label>
          <input type="datetime-local" name="dataEvento" value={form.dataEvento} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Local</label>
          <input name="local" value={form.local} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Vagas totais</label>
          <input type="number" name="vagasTotais" min="1" value={form.vagasTotais} onChange={handleChange} />
        </div>
        <button type="submit">Criar evento</button>
      </form>
    </div>
  )
}
