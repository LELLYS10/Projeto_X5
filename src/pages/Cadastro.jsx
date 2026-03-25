import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Input, Btn, Card } from '../components/UI'

export default function Cadastro() {
  const { usuario, addCliente } = useApp()
  const [form, setForm] = useState({ nome:'', wpp:'', cpf:'', ind:'', obs:'', valPretendido:'', dataPag:'' })
  const [enviado, setEnviado] = useState(false)
  const [modo, setModo] = useState('direto') // 'direto' | 'link'
  const [linkGerado, setLinkGerado] = useState('')

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const enviar = (e) => {
    e.preventDefault()
    if (!form.nome || !form.wpp || !form.cpf) { alert('Preencha nome, WhatsApp e CPF!'); return }
    addCliente({ ...form, gestorId: usuario.id, grupoId: usuario.grupo, valPretendido: parseFloat(form.valPretendido)||0 })
    setEnviado(true)
  }

  const gerarLink = () => {
    const id = Math.random().toString(36).substr(2, 8).toUpperCase()
    setLinkGerado(`credplus.app/cadastro?ref=${usuario.user}&id=${id}`)
  }

  if (enviado) return (
    <div className="p-4 fade-in">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-green-900/30 border border-green-700 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <div className="font-outfit font-black text-xl text-slate-100 mb-2">Enviado para Aprovação!</div>
        <div className="text-sm text-slate-500 text-center mb-6">O cadastro de {form.nome} foi enviado para análise do ADM.</div>
        <Btn onClick={() => { setEnviado(false); setForm({ nome:'', wpp:'', cpf:'', ind:'', obs:'', valPretendido:'', dataPag:'' }) }}>
          Novo Cadastro
        </Btn>
      </div>
    </div>
  )

  return (
    <div className="p-4 fade-in">
      <div className="font-outfit font-black text-xl text-slate-100 mb-1">Novo Cliente</div>
      <div className="text-xs text-slate-500 mb-4">Cadastre um cliente para aprovação</div>

      {/* Tabs modo */}
      <div className="flex gap-2 mb-4 bg-bg border border-border rounded-xl p-1.5">
        {[['direto','📝 Cadastro Direto'],['link','🔗 Gerar Link']].map(([v,l]) => (
          <button key={v} onClick={() => setModo(v)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${modo===v ? 'bg-surface text-slate-100 border border-border' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      {modo === 'link' ? (
        <Card>
          <div className="text-sm text-slate-400 mb-4">Gere um link e envie para o cliente preencher os dados.</div>
          {!linkGerado ? (
            <Btn onClick={gerarLink} className="w-full">GERAR LINK</Btn>
          ) : (
            <div>
              <div className="bg-bg border border-green-800/40 rounded-xl p-3 mb-3">
                <div className="text-xs font-bold text-accent mb-1">✓ Link Gerado!</div>
                <div className="text-xs text-slate-500 font-mono break-all mb-3">{linkGerado}</div>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(linkGerado).catch(()=>{})}
                    className="flex-1 py-2 bg-green-900/20 border border-green-800 rounded-lg text-xs font-bold text-green-300">
                    📋 Copiar
                  </button>
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Acesse: '+linkGerado)}`, '_blank')}
                    className="flex-1 py-2 bg-green-900/20 border border-green-800 rounded-lg text-xs font-bold text-green-300">
                    📲 WhatsApp
                  </button>
                </div>
              </div>
              <Btn variant="outline" onClick={() => setLinkGerado('')} className="w-full">Gerar Novo Link</Btn>
            </div>
          )}
        </Card>
      ) : (
        <form onSubmit={enviar}>
          <Card className="mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Dados do Cliente</div>
            <Input label="Nome Completo" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome completo" required />
            <Input label="WhatsApp" value={form.wpp} onChange={e => set('wpp', e.target.value)} placeholder="(85) 99999-9999" required />
            <Input label="CPF" value={form.cpf} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" required />
            <Input label="Indicado por (opcional)" value={form.ind} onChange={e => set('ind', e.target.value)} placeholder="Nome de quem indicou" />
          </Card>
          <Card className="mb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Solicitação</div>
            <Input label="Valor Pretendido (R$)" type="number" value={form.valPretendido} onChange={e => set('valPretendido', e.target.value)} placeholder="Ex: 1500" />
            <Input label="Dia preferido para pagar juros" type="number" min="1" max="31" value={form.dataPag} onChange={e => set('dataPag', e.target.value)} placeholder="Ex: 10" />
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Observação (opcional)</label>
              <textarea value={form.obs} onChange={e => set('obs', e.target.value)} placeholder="Alguma informação extra..."
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm resize-none h-20" />
            </div>
          </Card>
          <Btn type="submit" className="w-full">ENVIAR PARA APROVAÇÃO</Btn>
        </form>
      )}
    </div>
  )
}
