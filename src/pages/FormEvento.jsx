import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/api'

export default function FormEvento() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', descricao: '', dataEvento: '', local: '', vagasTotais: 10 })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    post('/eventos', form).then(() => navigate('/eventos'))
  }

  return (
    <div>
      <h1>Novo Evento</h1>
      <form className="card" onSubmit={handleSubmit}>
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
          <input type="number" name="vagasTotais" value={form.vagasTotais} onChange={handleChange} />
        </div>
        <button type="submit">Criar evento</button>
      </form>
    </div>
  )
}
