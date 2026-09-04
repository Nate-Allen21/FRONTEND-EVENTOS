export default function Notificacoes({ notificacoes = [] }) {
  return (
    <div>
      <h1>Notificações</h1>
      {notificacoes.length === 0 ? (
        <div className="card">
          <p>Nenhuma notificação registrada ainda.</p>
        </div>
      ) : (
        <div className="card">
          {notificacoes.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 0' }}>
              <strong>{item.mensagem}</strong>
              <div style={{ color: '#64748b', fontSize: 12 }}>{item.data}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
