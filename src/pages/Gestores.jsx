import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Avatar, Badge, Card, Modal, Input, Select, Btn, Toggle, Empty } from '../components/UI'

const CORES = ['#10b981','#f97316','#a855f7','#ec4899','#0ea5e9','#facc15','#ef4444','#14b8a6','#6366f1','#84cc16']
const PERMS_LABELS = {
  cadastrar:      { label:'Cadastrar Clientes',  sub:'Pode cadastrar novos clientes' },
  verClientes:    { label:'Ver Clientes',        sub:'Visualiza seus próprios clientes' },
  registrarPag:   { label:'Registrar Pagamento', sub:'Pode lançar pagamentos' },
  editarCadastro: { label:'Editar Cadastro',     sub:'Pode editar dados de clientes' },
  apagarCadastro: { label:'Apagar Cadastro',     sub:'Pode remover clientes' },
  terceiros:      { label:'Módulo Terceiros',    sub:'Acesso ao sistema privado de terceiros' },
}

const GRUPOS = [
  { id:'E', nome:'Grupo Especial', cor:'#10b981' },
  { id:'A', nome:'Grupo A',        cor:'#f97316' },
  { id:'B', nome:'Grupo B',        cor:'#ec4899' },
]

export default function Gestores() {
  const { usuario, gestores, addGestor, updatePerms, toggleGestorStatus, logout } = useApp()
  const [aba, setAba] = useState('gestores')
  const [modalNovo, setModalNovo] = useState(null) // grupoId
  const [modalPerm, setModalPerm] = useState(null) // gestor
  const [novoForm, setNovoForm] = useState({ nome:'', user:'', wpp:'', cor: CORES[0] })
  const [permsEdit, setPermsEdit] = useState({})
  const [corSel, setCorSel] = useState(CORES[0])

  const abrirNovo = (gid) => {
    const g = GRUPOS.find(x => x.id === gid)
    setCorSel(g.cor)
    setNovoForm({ nome:'', user:'', wpp:'', cor: g.cor })
    setModalNovo(gid)
  }

  const confirmarNovo = () => {
    if (!novoForm.nome || !novoForm.user) { alert('Preencha nome e usuário!'); return }
    addGestor({ ...novoForm, cor: corSel, senha:'1234', grupo: modalNovo })
    setModalNovo(null)
  }

  const abrirPerm = (g) => {
    setPermsEdit({ ...g.perms })
    setModalPerm(g)
  }

  const salvarPerms = () => {
    updatePerms(modalPerm.id, permsEdit)
    setModalPerm(null)
  }

  const togglePerm = (key) => setPermsEdit(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="p-4 fade-in">
      <div className="font-outfit font-black text-xl text-slate-100 mb-1">
        {aba === 'perfil' ? 'Meu Perfil' : 'Gestores'}
      </div>
      <div className="text-xs text-slate-500 mb-4">
        {aba === 'perfil' ? 'Suas informações de acesso' : 'Gerencie os gestores de cada grupo'}
      </div>

      {/* Tabs */}
      {usuario.grupo === 'E' && (
        <div className="flex gap-2 mb-4 bg-bg border border-border rounded-xl p-1.5">
          {[['gestores','👥 Gestores'],['perfil','👤 Perfil']].map(([v,l]) => (
            <button key={v} onClick={() => setAba(v)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${aba===v ? 'bg-surface text-slate-100 border border-border' : 'text-slate-500'}`}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* GESTORES */}
      {(aba === 'gestores' && usuario.grupo === 'E') && (
        <>
          {GRUPOS.map(g => {
            const lista = gestores.filter(x => x.grupo === g.id)
            return (
              <Card key={g.id} className="mb-4" accent={g.cor}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-outfit font-bold text-sm" style={{ color: g.cor }}>{g.nome}</div>
                    <div className="text-xs text-slate-500">{lista.length} gestor{lista.length!==1?'es':''}</div>
                  </div>
                  <button onClick={() => abrirNovo(g.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-black text-bg"
                    style={{ background: g.cor }}>
                    + Adicionar
                  </button>
                </div>
                {lista.map(gest => (
                  <div key={gest.id} className="flex items-center gap-3 bg-bg rounded-xl p-3 mb-2">
                    <Avatar nome={gest.nome} cor={gest.cor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate" style={{ color: gest.cor }}>{gest.nome}</div>
                      <div className="text-xs text-slate-600">@{gest.user}</div>
                    </div>
                    <Badge status={gest.status} />
                    <div className="flex gap-1.5">
                      <button onClick={() => abrirPerm(gest)}
                        className="px-2 py-1 bg-surface border border-border rounded-lg text-xs font-bold text-slate-400">
                        ⚙
                      </button>
                      <button onClick={() => toggleGestorStatus(gest.id)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border ${gest.status==='ativo' ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-green-900/20 border-green-800 text-green-400'}`}>
                        {gest.status==='ativo' ? '✕' : '✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </Card>
            )
          })}
        </>
      )}

      {/* PERFIL */}
      {(aba === 'perfil' || usuario.grupo !== 'E') && (
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <Avatar nome={usuario.nome} cor={usuario.cor} size="lg" />
            <div>
              <div className="font-outfit font-black text-lg text-slate-100">{usuario.nome}</div>
              <div className="text-xs font-bold" style={{ color: usuario.cor }}>
                {GRUPOS.find(g=>g.id===usuario.grupo)?.nome}
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            {[
              ['Usuário',  `@${usuario.user}`],
              ['WhatsApp', usuario.wpp],
              ['Acesso',   usuario.grupo === 'E' ? 'Total' : 'Limitado'],
              ['Status',   usuario.status],
            ].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
                <span className="text-xs text-slate-500 font-bold uppercase">{l}</span>
                <span className="text-xs font-black text-slate-300">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Btn variant="outline" onClick={logout} className="w-full">Sair da Conta</Btn>
          </div>
        </Card>
      )}

      {/* Modal Novo Gestor */}
      <Modal open={!!modalNovo} onClose={() => setModalNovo(null)} title={`Novo Gestor — ${GRUPOS.find(g=>g.id===modalNovo)?.nome}`}>
        <Input label="Nome Completo" value={novoForm.nome} onChange={e => setNovoForm(p=>({...p,nome:e.target.value}))} placeholder="Nome do gestor" />
        <Input label="Usuário (login)" value={novoForm.user} onChange={e => setNovoForm(p=>({...p,user:e.target.value.toLowerCase()}))} placeholder="Ex: joao" />
        <Input label="WhatsApp" value={novoForm.wpp} onChange={e => setNovoForm(p=>({...p,wpp:e.target.value}))} placeholder="(85) 99999-9999" />
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cor do Gestor</label>
          <div className="flex flex-wrap gap-2">
            {CORES.map(c => (
              <div key={c} onClick={() => setCorSel(c)}
                className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${corSel===c ? 'scale-125 ring-2 ring-white' : ''}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-500 mb-4">Senha padrão: <span className="font-bold text-slate-300">1234</span> (o gestor pode alterar depois)</div>
        <div className="flex gap-2">
          <Btn variant="outline" onClick={() => setModalNovo(null)} className="flex-1">Cancelar</Btn>
          <Btn onClick={confirmarNovo} className="flex-1">ADICIONAR</Btn>
        </div>
      </Modal>

      {/* Modal Permissões */}
      <Modal open={!!modalPerm} onClose={() => setModalPerm(null)} title={`Permissões — ${modalPerm?.nome}`}>
        {Object.entries(PERMS_LABELS).map(([key, info]) => (
          <div key={key} className="flex justify-between items-center py-3 border-b border-border last:border-0">
            <div>
              <div className="text-sm text-slate-200 font-bold">{info.label}</div>
              <div className="text-xs text-slate-500">{info.sub}</div>
            </div>
            <Toggle checked={permsEdit[key]||false} onChange={() => togglePerm(key)} />
          </div>
        ))}
        <Btn onClick={salvarPerms} className="w-full mt-4">SALVAR PERMISSÕES</Btn>
      </Modal>
    </div>
  )
}
