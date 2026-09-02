import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Participantes() {
  const [participantes, setParticipantes] = useState([])

  useEffect(() => {
    get('/participantes').then(setParticipantes)
  }, [])

  return (
    <div>
      <h1>Participantes</h1>
      <table>
        <thead><tr><th>Nome</th><th>Email</th><th>CPF</th></tr></thead>
        <tbody>
          {participantes.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.email}</td>
              <td>{p.cpf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
