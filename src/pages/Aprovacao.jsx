import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, Card, Modal, Input, Select, Btn, Empty } from '../components/UI'

export default function Aprovacao() {
  const { clientes, gestores, aprovarCliente, reprovarCliente, fmt } = useApp()
  const [aba, setAba] = useState('pendente')
  const [modal, setModal] = useState(null)
  const [emp, setEmp] = useState({ val:'', perc:'10', mod:'recorrente', parcelas:'3' })

  const lista = clientes.filter(c => c.status === aba)
  const pendCount = clientes.filter(c => c.status === 'pendente').length

  const gerarParcelas = (e) => {
    if (e.mod !== 'parcelado') return []
    return Array.from({ length: parseInt(e.parcelas)||1 }, (_, i) => {
      const hoje = new Date()
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, parseInt(e.dataPag)||1)
      return { n: i+1, status: 'pendente', dataPrev: d.toLocaleDateString('pt-BR') }
    })
  }

  const confirmar = () => {
    if (!emp.val) { alert('Informe o valor!'); return }
    const v = parseFloat(emp.val)
    const p = parseFloat(emp.perc)||0
    aprovarCliente(modal.id, {
      mod: emp.mod,
      val: v, saldo: v,
      perc: p,
      parcelas: emp.mod === 'parcelado' ? parseInt(emp.parcelas)||1 : null,
      dataPag: modal.dataPag,
      parcelasList: gerarParcelas({ ...emp, dataPag: modal.dataPag }),
    })
    setModal(null)
  }

  const jur = parseFloat(emp.val||0) * (parseFloat(emp.perc||0)/100)
  const cap = emp.mod === 'parcelado' ? parseFloat(emp.val||0) / (parseInt(emp.parcelas)||1) : 0

  return (
    <div className="p-4 fade-in">
      <div className="font-outfit font-black text-xl text-slate-100 mb-1">Aprovação</div>
      <div className="text-xs text-slate-500 mb-4">Analise os cadastros dos clientes</div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-bg border border-border rounded-xl p-1.5">
        {[['pendente','⏳ Pendentes'],['aprovado','✅ Aprovados'],['reprovado','❌ Reprovados']].map(([v,l]) => (
          <button key={v} onClick={() => setAba(v)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors relative ${aba===v ? 'bg-surface text-slate-100 border border-border' : 'text-slate-500'}`}>
            {l}
            {v==='pendente' && pendCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full text-xs font-black text-bg flex items-center justify-center">{pendCount}</span>
            )}
          </button>
        ))}
      </div>

      {lista.length === 0
        ? <Empty icon={aba==='pendente'?'📭':'🎉'} text={`Nenhum cadastro ${aba}`} />
        : lista.map(c => {
          const gestor = gestores.find(g => g.id === c.gestorId)
          const cor = gestor?.cor || '#94a3b8'
          return (
            <Card key={c.id} className="mb-3" accent={cor}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-outfit font-bold text-base" style={{ color: cor }}>{c.nome}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Gestor: <span style={{ color: cor }} className="font-bold">{gestor?.nome}</span>
                  </div>
                </div>
                <Badge status={c.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  ['Valor Solicitado', fmt(c.valPretendido)],
                  ['Dia de Pagamento', `Dia ${c.dataPag}`],
                  ['WhatsApp', c.wpp],
                  ['Indicado por', c.ind || '—'],
                ].map(([l,v]) => (
                  <div key={l} className="bg-bg rounded-lg p-2">
                    <div className="text-xs text-slate-600 font-bold uppercase">{l}</div>
                    <div className="text-xs font-black text-slate-300 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              {c.obs && <div className="text-xs text-slate-500 bg-bg rounded-lg p-2 mb-3">💬 {c.obs}</div>}
              {c.status === 'pendente' && (
                <div className="flex gap-2">
                  <Btn onClick={() => setModal(c)} className="flex-1">✓ Aprovar e Ativar</Btn>
                  <Btn variant="danger" onClick={() => reprovarCliente(c.id)} className="flex-1">✗ Reprovar</Btn>
                </div>
              )}
            </Card>
          )
        })
      }

      {/* Modal Ativar */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={`Ativar — ${modal?.nome}`}>
        <div className="text-xs text-slate-500 mb-4">Solicitou: {fmt(modal?.valPretendido)} · Dia {modal?.dataPag}</div>
        <Input label="Valor Aprovado (R$)" type="number" value={emp.val} onChange={e => setEmp(p=>({...p,val:e.target.value}))} placeholder="Ex: 1500" />
        <Input label="% Juros ao Mês" type="number" value={emp.perc} onChange={e => setEmp(p=>({...p,perc:e.target.value}))} placeholder="Ex: 10" />
        <Select label="Modalidade" value={emp.mod} onChange={e => setEmp(p=>({...p,mod:e.target.value}))}>
          <option value="recorrente">🔄 Juros Recorrente</option>
          <option value="parcelado">📦 Parcelado</option>
          <option value="fixo">💲 Valor Fixo</option>
        </Select>
        {emp.mod === 'parcelado' && (
          <Input label="Número de Parcelas" type="number" value={emp.parcelas} onChange={e => setEmp(p=>({...p,parcelas:e.target.value}))} placeholder="Ex: 3" />
        )}
        {/* Preview cálculo */}
        <div className="bg-bg rounded-xl p-3 mb-4">
          <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Juros Mensal</span><span className="text-xs font-black text-blue-400">{fmt(jur)}</span></div>
          {emp.mod === 'parcelado' && <>
            <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Capital/Parcela</span><span className="text-xs font-black text-slate-300">{fmt(cap)}</span></div>
            <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Total/Parcela</span><span className="text-xs font-black text-accent">{fmt(cap + jur/(parseInt(emp.parcelas)||1))}</span></div>
          </>}
          {emp.mod === 'recorrente' && <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Capital</span><span className="text-xs font-black text-slate-300">Intacto até amortização</span></div>}
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" onClick={() => setModal(null)} className="flex-1">Cancelar</Btn>
          <Btn onClick={confirmar} className="flex-2">ATIVAR CONTRATO</Btn>
        </div>
      </Modal>
    </div>
  )
}
