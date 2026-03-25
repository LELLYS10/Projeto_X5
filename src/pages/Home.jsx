import { useApp } from '../context/AppContext'
import { StatCard, Card, Badge, Empty } from '../components/UI'

export default function Home() {
  const { usuario, clientes, gestores, fmt, getStatus } = useApp()

  const meus = clientes.filter(c => {
    if (usuario.grupo === 'E') return true
    return c.gestorId === usuario.id
  }).filter(c => c.status === 'aprovado' && c.emprestimo)

  const stats = {
    total:   meus.length,
    vencido: meus.filter(c => getStatus(c.emprestimo?.saldo > 0 ? c.dataPag : null) === 'VENCIDO').length,
    hoje:    meus.filter(c => getStatus(c.dataPag) === 'HOJE').length,
    amanha:  meus.filter(c => getStatus(c.dataPag) === 'AMANHÃ').length,
  }

  const pendentes = clientes.filter(c => c.status === 'pendente').length

  return (
    <div className="p-4 fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 border border-green-900/30 rounded-2xl p-4 mb-4">
        <div className="text-green-300 font-bold text-sm">Olá, {usuario.nome.split(' ')[0]} 👋</div>
        <div className="text-slate-500 text-xs mt-0.5">Resumo dos seus clientes hoje</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Clientes Ativos" value={stats.total}   color="#22c55e" />
        <StatCard label="Vencidos"         value={stats.vencido} color="#ef4444" />
        <StatCard label="Vence Hoje"       value={stats.hoje}    color="#3b82f6" />
        <StatCard label="Vence Amanhã"     value={stats.amanha}  color="#f59e0b" />
      </div>

      {/* Pendentes (só Grupo E) */}
      {usuario.grupo === 'E' && pendentes > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 mb-4 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <div>
            <div className="text-yellow-300 text-sm font-bold">{pendentes} cadastro{pendentes > 1 ? 's' : ''} aguardando aprovação</div>
            <div className="text-xs text-slate-500">Vá em Aprovação para analisar</div>
          </div>
        </div>
      )}

      {/* Lista clientes */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {usuario.grupo === 'E' ? 'Todos os Clientes' : 'Meus Clientes'}
        </div>
      </div>

      {meus.length === 0
        ? <Empty icon="📭" text="Nenhum cliente ativo ainda" />
        : meus.map(c => {
            const status = getStatus(c.dataPag)
            const cor = gestores.find(g => g.id === c.gestorId)?.cor || '#94a3b8'
            const jur = c.emprestimo ? c.emprestimo.saldo * (c.emprestimo.perc / 100) : 0
            return (
              <Card key={c.id} className="mb-3" accent={cor}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-outfit font-bold text-base" style={{ color: cor }}>{c.nome}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {c.emprestimo?.mod === 'parcelado' ? '📦 Parcelado' : c.emprestimo?.mod === 'recorrente' ? '🔄 Recorrente' : '💲 Fixo'}
                      {' · '}{c.emprestimo?.perc}% a.m.
                    </div>
                  </div>
                  <Badge status={status} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-bg rounded-lg p-2">
                    <div className="text-xs text-slate-600 font-bold uppercase">Saldo</div>
                    <div className="text-sm font-black text-slate-200">{fmt(c.emprestimo?.saldo)}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-2">
                    <div className="text-xs text-slate-600 font-bold uppercase">Juros/Mês</div>
                    <div className="text-sm font-black text-blue-400">{fmt(jur)}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-2">
                    <div className="text-xs text-slate-600 font-bold uppercase">Venc.</div>
                    <div className="text-xs font-black text-slate-300">Dia {c.dataPag}</div>
                  </div>
                </div>
              </Card>
            )
          })
      }
    </div>
  )
}
