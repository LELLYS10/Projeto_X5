import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login } = useApp()
  const [user, setUser]       = useState('')
  const [senha, setSenha]     = useState('')
  const [erro, setErro]       = useState('')
  const [tentativas, setTent] = useState(0)
  const [bloqueado, setBloq]  = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (bloqueado) return
    const ok = login(user.trim(), senha.trim())
    if (ok) { setErro(''); setTent(0) } else {
      const novas = tentativas + 1
      setTent(novas)
      if (novas >= 3) { setBloq(true); setErro('Acesso bloqueado. Contate o administrador.') }
      else setErro(`Usuário ou senha incorretos. (${novas}/3 tentativas)`)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-outfit text-4xl font-black text-slate-100 tracking-tight">CRED<span className="text-accent">PLUS</span></div>
          <div className="w-10 h-0.5 bg-accent mx-auto my-3 rounded-full" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gestão de Empréstimos</div>
        </div>
        <div className="bg-surface border border-border rounded-3xl p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Usuário</label>
              <input value={user} onChange={e => setUser(e.target.value)} placeholder="Seu usuário" disabled={bloqueado} className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm disabled:opacity-50" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" disabled={bloqueado} className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm disabled:opacity-50" />
            </div>
            {erro && <div className={`text-xs font-bold mb-4 text-center ${bloqueado ? 'text-red-500' : 'text-red-400'}`}>{erro}</div>}
            <button type="submit" disabled={bloqueado} className="w-full py-3.5 bg-accent text-bg font-outfit font-black text-base rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">ENTRAR</button>
          </form>
          <div className="text-center mt-4 text-xs text-slate-600">Acesso restrito a gestores autorizados</div>
        </div>
      </div>
    </div>
  )
}
