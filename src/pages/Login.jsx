import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/api'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nome: '', email: 'admin@eventos.com', senha: 'admin123', perfil: 'ADMIN' })
  const [erro, setErro] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('eventos-user')
    if (user) {
      navigate('/')
    }
  }, [navigate])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    try {
      const payload = modo === 'login'
        ? { email: form.email, senha: form.senha }
        : { nome: form.nome, email: form.email, senha: form.senha, perfil: form.perfil }

      const endpoint = modo === 'login' ? '/auth/login' : '/auth/registrar'
      const usuario = await post(endpoint, payload)

      localStorage.setItem('eventos-user', JSON.stringify(usuario))
      onLogin(usuario)
      navigate('/')
    } catch (err) {
      setErro(err.message || 'Não foi possível realizar a operação.')
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <div className="card">
        <h1>{modo === 'login' ? 'Acessar sistema' : 'Cadastrar usuário'}</h1>
        {erro && <p style={{ color: 'crimson', marginBottom: 12 }}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          {modo === 'registro' && (
            <div className="field">
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} />
            </div>
          )}

          <div className="field">
            <label>E-mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} />
          </div>

          {modo === 'registro' && (
            <div className="field">
              <label>Perfil</label>
              <select name="perfil" value={form.perfil} onChange={handleChange}>
                <option value="ADMIN">Administrador</option>
                <option value="PARTICIPANTE">Participante</option>
              </select>
            </div>
          )}

          <button type="submit" style={{ width: '100%', marginBottom: 12 }}>
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          type="button"
          className="secondary"
          onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
          style={{ width: '100%' }}
        >
          {modo === 'login' ? 'Quero me cadastrar' : 'Já tenho conta'}
        </button>
      </div>
    </div>
  )
}
