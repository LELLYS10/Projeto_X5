import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, Card, StatCard, Modal, Input, Btn, Empty } from '../components/UI'

export default function Emprestimos() {
  const { usuario, clientes, gestores, fmt, getStatus, pagarJuros, pagarParcelaJuros, pagarParcelaTotal, amortizar, historico } = useApp()
  const [aba, setAba] = useState('ativos')
  const [modalAmort, setModalAmort] = useState(null)
  const [amortVal, setAmortVal] = useState('')

  const ativos = clientes.filter(c => {
    const meu = usuario.grupo === 'E' ? true : c.gestorId === usuario.id
    return meu && c.status === 'aprovado' && c.emprestimo
  })

  const totalCap  = ativos.reduce((a, c) => a + (c.emprestimo?.saldo||0), 0)
  const totalJur  = ativos.reduce((a, c) => a + (c.emprestimo?.saldo||0) * ((c.emprestimo?.perc||0)/100), 0)
  const totalCapR = ativos.reduce((a, c) => a + (c.emprestimo?.capitalRecebido||0), 0)
  const totalJurR = ativos.reduce((a, c) => a + (c.emprestimo?.jurosRecebido||0), 0)

  const confirmarAmort = () => {
    const v = parseFloat(amortVal)
    if (!v || v <= 0) { alert('Informe um valor válido!'); return }
    amortizar(modalAmort.id, v)
    setModalAmort(null); setAmortVal('')
  }

  const parcelados = ativos.filter(c => c.emprestimo?.mod === 'parcelado')

  return (
    <div className="p-4 fade-in">
      <div className="font-outfit font-black text-xl text-slate-100 mb-1">Empréstimos</div>
      <div className="text-xs text-slate-500 mb-4">Contratos ativos e recebimentos</div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 bg-bg border border-border rounded-xl p-1.5">
        {[['ativos','📋 Ativos'],['recebimentos','💰 Recebimentos'],['parcelados','📦 Parcelados']].map(([v,l]) => (
          <button key={v} onClick={() => setAba(v)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${aba===v ? 'bg-surface text-slate-100 border border-border' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ATIVOS */}
      {aba === 'ativos' && <>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Capital Ativo"    value={fmt(totalCap)}  color="#22c55e" />
          <StatCard label="Juros a Receber"  value={fmt(totalJur)}  color="#3b82f6" />
        </div>
        {ativos.length === 0
          ? <Empty icon="📭" text="Nenhum contrato ativo" />
          : ativos.map(c => {
            const cor = gestores.find(g => g.id === c.gestorId)?.cor || '#94a3b8'
            const jur = (c.emprestimo.saldo * c.emprestimo.perc) / 100
            const status = getStatus(c.dataPag)
            return (
              <Card key={c.id} className="mb-3" accent={cor}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-outfit font-bold" style={{ color: cor }}>{c.nome}</div>
                    <div className="text-xs text-slate-500">{c.emprestimo.mod} · {c.emprestimo.perc}% a.m.</div>
                  </div>
                  <Badge status={status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-bg rounded-lg p-2"><div className="text-xs text-slate-600 font-bold">Saldo</div><div className="text-sm font-black text-slate-200">{fmt(c.emprestimo.saldo)}</div></div>
                  <div className="bg-bg rounded-lg p-2"><div className="text-xs text-slate-600 font-bold">Juros/Mês</div><div className="text-sm font-black text-blue-400">{fmt(jur)}</div></div>
                  <div className="bg-bg rounded-lg p-2"><div className="text-xs text-slate-600 font-bold">Dia Pag.</div><div className="text-sm font-black text-slate-300">{c.dataPag}</div></div>
                </div>
                {/* Capital x Juros recebidos */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-bg rounded-lg p-2 border-l-2 border-accent">
                    <div className="text-xs text-accent font-bold">Capital Rec.</div>
                    <div className="text-sm font-black text-accent">{fmt(c.emprestimo.capitalRecebido)}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-2 border-l-2 border-blue-500">
                    <div className="text-xs text-blue-400 font-bold">Juros Rec.</div>
                    <div className="text-sm font-black text-blue-400">{fmt(c.emprestimo.jurosRecebido)}</div>
                  </div>
                </div>
                {/* Ações */}
                {c.emprestimo.mod !== 'parcelado' && (
                  <div className="flex gap-2">
                    <button onClick={() => pagarJuros(c.id)}
                      className="flex-1 py-2 bg-blue-900/20 border border-blue-800 rounded-xl text-xs font-bold text-blue-300">
                      Pagar Juros {fmt(jur)}
                    </button>
                    <button onClick={() => { setModalAmort(c); setAmortVal('') }}
                      className="flex-1 py-2 bg-yellow-900/20 border border-yellow-800 rounded-xl text-xs font-bold text-yellow-300">
                      Amortizar
                    </button>
                  </div>
                )}
                {c.emprestimo.mod === 'parcelado' && (
                  <button onClick={() => { setModalAmort(c); setAmortVal('') }}
                    className="w-full py-2 bg-yellow-900/20 border border-yellow-800 rounded-xl text-xs font-bold text-yellow-300">
                    Amortizar Capital
                  </button>
                )}
              </Card>
            )
          })
        }
      </>}

      {/* RECEBIMENTOS */}
      {aba === 'recebimentos' && <>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Capital Rec."  value={fmt(totalCapR)} color="#22c55e" />
          <StatCard label="Juros Rec."    value={fmt(totalJurR)} color="#3b82f6" />
        </div>
        <div className="bg-bg border border-border rounded-xl p-3 mb-4">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Recebido</div>
          <div className="font-outfit font-black text-2xl text-yellow-400">{fmt(totalCapR + totalJurR)}</div>
        </div>
        {historico.length === 0
          ? <Empty icon="💸" text="Nenhum recebimento registrado" />
          : [...historico].reverse().map(h => (
            <div key={h.id} className="flex justify-between items-center bg-surface border border-border rounded-xl p-3 mb-2">
              <div>
                <div className="text-sm font-bold text-slate-200">{h.nome}</div>
                <div className="text-xs text-slate-500">{h.tipo} · {h.data}</div>
              </div>
              <div className="text-right">
                {h.capital > 0 && <div className="text-xs font-black text-accent">+{fmt(h.capital)}</div>}
                {h.juros > 0   && <div className="text-xs font-black text-blue-400">+{fmt(h.juros)}</div>}
              </div>
            </div>
          ))
        }
      </>}

      {/* PARCELADOS */}
      {aba === 'parcelados' && <>
        {parcelados.length === 0
          ? <Empty icon="📦" text="Nenhum empréstimo parcelado" />
          : parcelados.map(c => {
            const cor = gestores.find(g => g.id === c.gestorId)?.cor || '#94a3b8'
            const capParc = c.emprestimo.val / c.emprestimo.parcelas
            const jurParc = c.emprestimo.saldo * (c.emprestimo.perc/100)
            return (
              <Card key={c.id} className="mb-3" accent={cor}>
                <div className="font-outfit font-bold mb-1" style={{ color: cor }}>{c.nome}</div>
                <div className="text-xs text-slate-500 mb-3">
                  {c.emprestimo.parcelas}x · {c.emprestimo.perc}% · Cap/parcela: {fmt(capParc)} · Juros: {fmt(jurParc)}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Parcelas</div>
                {c.emprestimo.parcelasList.map(p => {
                  const pago = p.status === 'pago_total'
                  const juroPago = p.status === 'pago_juro'
                  return (
                    <div key={p.n} className="flex items-center gap-3 bg-bg rounded-xl p-3 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${pago ? 'bg-green-900/30 text-green-400' : 'bg-surface text-slate-500'}`}>{p.n}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-300">
                          {pago ? '✓ Pago completo' : juroPago ? '↪ Só juros pagos' : fmt(capParc + jurParc)}
                        </div>
                        <div className="text-xs text-slate-600">{p.dataPrev}</div>
                      </div>
                      {!pago && (
                        <div className="flex gap-1.5">
                          <button onClick={() => pagarParcelaJuros(c.id, p.n)}
                            className="px-2 py-1 bg-blue-900/20 border border-blue-800 rounded-lg text-xs font-bold text-blue-300">
                            Só Juros
                          </button>
                          <button onClick={() => pagarParcelaTotal(c.id, p.n)}
                            className="px-2 py-1 bg-accent rounded-lg text-xs font-black text-bg">
                            Pagar Tudo
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </Card>
            )
          })
        }
      </>}

      {/* Modal Amortizar */}
      <Modal open={!!modalAmort} onClose={() => setModalAmort(null)} title="Amortização de Capital">
        {modalAmort && (
          <>
            <div className="text-xs text-slate-500 mb-4">
              Cliente: {modalAmort.nome} · Saldo: {fmt(modalAmort.emprestimo?.saldo)}
            </div>
            <Input label="Valor da Amortização (R$)" type="number" value={amortVal}
              onChange={e => setAmortVal(e.target.value)} placeholder="Ex: 200" />
            {amortVal > 0 && (
              <div className="bg-bg rounded-xl p-3 mb-4">
                <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Saldo Atual</span><span className="text-xs font-black text-slate-300">{fmt(modalAmort.emprestimo?.saldo)}</span></div>
                <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Após Amortização</span><span className="text-xs font-black text-accent">{fmt(Math.max(0, (modalAmort.emprestimo?.saldo||0) - parseFloat(amortVal)))}</span></div>
                <div className="flex justify-between py-1"><span className="text-xs text-slate-500">Novo Juros/Mês</span><span className="text-xs font-black text-blue-400">{fmt(Math.max(0, (modalAmort.emprestimo?.saldo||0) - parseFloat(amortVal)) * (modalAmort.emprestimo?.perc||0)/100)}</span></div>
              </div>
            )}
            <div className="flex gap-2">
              <Btn variant="outline" onClick={() => setModalAmort(null)} className="flex-1">Cancelar</Btn>
              <Btn onClick={confirmarAmort} className="flex-1">CONFIRMAR</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
