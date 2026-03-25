import { createContext, useContext, useState } from 'react'

// ─── DADOS INICIAIS ───────────────────────────────────────────────────────────
const GESTORES_INICIAIS = [
  { id:1, nome:'Lellys Flávio', user:'lellys', senha:'1234', wpp:'(85) 99000-0000', cor:'#10b981', grupo:'E', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:true, editarCadastro:true, apagarCadastro:true, terceiros:false } },
  { id:2, nome:'Jailton',     user:'jailton', senha:'1234', wpp:'(85) 99111-0001', cor:'#ffffff', grupo:'A', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:true } },
  { id:3, nome:'Ricardo',     user:'ricardo', senha:'1234', wpp:'(85) 99111-0002', cor:'#f97316', grupo:'A', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:true } },
  { id:4, nome:'Mangu',       user:'mangu',   senha:'1234', wpp:'(85) 99111-0003', cor:'#1d4ed8', grupo:'A', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:true } },
  { id:5, nome:'Matheus Tuk', user:'matheus', senha:'1234', wpp:'(85) 99111-0004', cor:'#a855f7', grupo:'A', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:true } },
  { id:6, nome:'Sanny',  user:'sanny',  senha:'1234', wpp:'(85) 99222-0001', cor:'#ec4899', grupo:'B', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:false } },
  { id:7, nome:'Marcos', user:'marcos', senha:'1234', wpp:'(85) 99222-0002', cor:'#0ea5e9', grupo:'B', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:false } },
  { id:8, nome:'Jean',   user:'jean',   senha:'1234', wpp:'(85) 99222-0003', cor:'#facc15', grupo:'B', status:'ativo',
    perms:{ cadastrar:true, verClientes:true, registrarPag:false, editarCadastro:false, apagarCadastro:false, terceiros:false } },
]

const CLIENTES_INICIAIS = [
  { id:1, nome:'JOÃO SILVA',   wpp:'(85) 99111-1111', cpf:'123.456.789-00', ind:'Carlos', obs:'Urgente', valPretendido:1500, dataPag:'10', gestorId:1, grupoId:'E', status:'aprovado',
    emprestimo:{ mod:'parcelado', val:900, saldo:900, perc:10, parcelas:3, capitalRecebido:0, jurosRecebido:0,
      parcelasList:[{n:1,status:'pendente',dataPrev:'25/03/2026'},{n:2,status:'pendente',dataPrev:'25/04/2026'},{n:3,status:'pendente',dataPrev:'25/05/2026'}] } },
  { id:2, nome:'MARIA SANTOS', wpp:'(85) 99222-2222', cpf:'987.654.321-00', ind:'', obs:'', valPretendido:2000, dataPag:'20', gestorId:6, grupoId:'B', status:'aprovado',
    emprestimo:{ mod:'recorrente', val:2000, saldo:2000, perc:8, parcelas:null, capitalRecebido:0, jurosRecebido:320, parcelasList:[] } },
  { id:3, nome:'PEDRO ALVES',  wpp:'(85) 99333-3333', cpf:'111.222.333-00', ind:'Jean', obs:'', valPretendido:800, dataPag:'5', gestorId:7, grupoId:'B', status:'pendente',
    emprestimo:null },
]

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuario, setUsuario]       = useState(null)
  const [gestores, setGestores]     = useState(GESTORES_INICIAIS)
  const [clientes, setClientes]     = useState(CLIENTES_INICIAIS)
  const [historico, setHistorico]   = useState([])

  // LOGIN
  const login = (user, senha) => {
    const g = gestores.find(x => x.user === user.toLowerCase() && x.senha === senha && x.status === 'ativo')
    if (g) { setUsuario(g); return true }
    return false
  }
  const logout = () => setUsuario(null)

  // CLIENTES
  const addCliente = (dados) => {
    const novo = { ...dados, id: Date.now(), status: 'pendente', emprestimo: null }
    setClientes(prev => [...prev, novo])
  }

  const aprovarCliente = (id, empDados) => {
    setClientes(prev => prev.map(c => c.id === id
      ? { ...c, status: 'aprovado', emprestimo: { ...empDados, capitalRecebido: 0, jurosRecebido: 0, parcelasList: gerarParcelas(empDados) } }
      : c))
  }

  const reprovarCliente = (id) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, status: 'reprovado' } : c))
  }

  const gerarParcelas = (emp) => {
    if (emp.mod !== 'parcelado') return []
    return Array.from({ length: emp.parcelas }, (_, i) => ({
      n: i + 1, status: 'pendente',
      dataPrev: calcProxData(emp.dataPag, i)
    }))
  }

  const calcProxData = (dia, mesesAdiante) => {
    const hoje = new Date()
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + mesesAdiante, parseInt(dia))
    return d.toLocaleDateString('pt-BR')
  }

  // PAGAMENTOS
  const pagarJuros = (clienteId) => {
    setClientes(prev => prev.map(c => {
      if (c.id !== clienteId || !c.emprestimo) return c
      const jur = c.emprestimo.saldo * (c.emprestimo.perc / 100)
      addHistorico({ nome: c.nome, tipo: 'Juros', capital: 0, juros: jur })
      return { ...c, emprestimo: { ...c.emprestimo, jurosRecebido: c.emprestimo.jurosRecebido + jur } }
    }))
  }

  const pagarParcelaJuros = (clienteId, numParcela) => {
    setClientes(prev => prev.map(c => {
      if (c.id !== clienteId || !c.emprestimo) return c
      const jur = c.emprestimo.saldo * (c.emprestimo.perc / 100)
      const novasList = c.emprestimo.parcelasList.map(p => {
        if (p.n !== numParcela) return p
        const [d, m, y] = p.dataPrev.split('/').map(Number)
        const nova = new Date(y, m, d)
        return { ...p, status: 'pago_juro', dataPrev: nova.toLocaleDateString('pt-BR') }
      })
      addHistorico({ nome: c.nome, tipo: `Juros parcela ${numParcela}`, capital: 0, juros: jur })
      return { ...c, emprestimo: { ...c.emprestimo, jurosRecebido: c.emprestimo.jurosRecebido + jur, parcelasList: novasList } }
    }))
  }

  const pagarParcelaTotal = (clienteId, numParcela) => {
    setClientes(prev => prev.map(c => {
      if (c.id !== clienteId || !c.emprestimo) return c
      const cap = c.emprestimo.val / c.emprestimo.parcelas
      const jur = c.emprestimo.saldo * (c.emprestimo.perc / 100)
      const novoSaldo = Math.max(0, c.emprestimo.saldo - cap)
      const novasList = c.emprestimo.parcelasList.map(p =>
        p.n === numParcela ? { ...p, status: 'pago_total' } : p)
      addHistorico({ nome: c.nome, tipo: `Parcela ${numParcela} completa`, capital: cap, juros: jur })
      return { ...c, emprestimo: { ...c.emprestimo, saldo: novoSaldo, capitalRecebido: c.emprestimo.capitalRecebido + cap, jurosRecebido: c.emprestimo.jurosRecebido + jur, parcelasList: novasList } }
    }))
  }

  const amortizar = (clienteId, valor) => {
    setClientes(prev => prev.map(c => {
      if (c.id !== clienteId || !c.emprestimo) return c
      const novoSaldo = Math.max(0, c.emprestimo.saldo - valor)
      addHistorico({ nome: c.nome, tipo: 'Amortização', capital: valor, juros: 0 })
      return { ...c, emprestimo: { ...c.emprestimo, saldo: novoSaldo, capitalRecebido: c.emprestimo.capitalRecebido + valor } }
    }))
  }

  const addHistorico = (item) => {
    setHistorico(prev => [...prev, { ...item, data: new Date().toLocaleDateString('pt-BR'), id: Date.now() }])
  }

  // GESTORES
  const addGestor = (dados) => {
    setGestores(prev => [...prev, { ...dados, id: Date.now(), status: 'ativo',
      perms: { cadastrar: true, verClientes: true, registrarPag: dados.grupo === 'E', editarCadastro: dados.grupo === 'E', apagarCadastro: dados.grupo === 'E', terceiros: dados.grupo === 'A' } }])
  }

  const updatePerms = (gestorId, perms) => {
    setGestores(prev => prev.map(g => g.id === gestorId ? { ...g, perms } : g))
  }

  const toggleGestorStatus = (gestorId) => {
    setGestores(prev => prev.map(g => g.id === gestorId ? { ...g, status: g.status === 'ativo' ? 'inativo' : 'ativo' } : g))
  }

  // STATUS DO CLIENTE
  const getStatus = (dataPag) => {
    if (!dataPag) return 'EM DIA'
    const hoje = new Date(); hoje.setHours(0,0,0,0)
    const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1)
    const [d, m, y] = dataPag.toString().includes('/') ? dataPag.split('/').map(Number) : [parseInt(dataPag), hoje.getMonth()+1, hoje.getFullYear()]
    const venc = new Date(y || hoje.getFullYear(), (m || hoje.getMonth()+1) - 1, d)
    venc.setHours(0,0,0,0)
    if (venc < hoje) return 'VENCIDO'
    if (venc.getTime() === hoje.getTime()) return 'HOJE'
    if (venc.getTime() === amanha.getTime()) return 'AMANHÃ'
    return 'EM DIA'
  }

  const fmt = (v) => 'R$ ' + parseFloat(v||0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <AppContext.Provider value={{
      usuario, login, logout,
      gestores, addGestor, updatePerms, toggleGestorStatus,
      clientes, addCliente, aprovarCliente, reprovarCliente,
      pagarJuros, pagarParcelaJuros, pagarParcelaTotal, amortizar,
      historico, fmt, getStatus
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
