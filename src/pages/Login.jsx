import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login } = useApp()
  const [user, setUser]   = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro]   = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const ok = login(user.trim(), senha.trim())
    if (!ok) setErro('Usuário ou senha incorretos.')
    else setErro('')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="font-outfit text-4xl font-black text-slate-100 tracking-tight">
            CRED<span className="text-accent">PLUS</span>
          </div>
          <div className="w-10 h-0.5 bg-accent mx-auto my-3 rounded-full" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gestão de Empréstimos</div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-3xl p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Usuário</label>
              <input value={user} onChange={e => setUser(e.target.value)}
                placeholder="Seu usuário de acesso"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm" />
            </div>
            {erro && <div className="text-red-400 text-xs font-bold mb-4 text-center">{erro}</div>}
            <button type="submit"
              className="w-full py-3.5 bg-accent text-bg font-outfit font-black text-base rounded-xl hover:opacity-90 transition-opacity">
              ENTRAR
            </button>
          </form>
          <div className="text-center mt-4 text-xs text-slate-600">
            Acesso restrito a gestores autorizados
          </div>
          <div className="mt-4 p-3 bg-bg rounded-xl border border-border">
            <div className="text-xs text-slate-600 text-center mb-1 font-bold">DEMO — qualquer usuário abaixo, senha: 1234</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {['lellys','jailton','ricardo','sanny','marcos','jean'].map(u => (
                <button key={u} onClick={() => setUser(u)}
                  className="text-xs px-2 py-0.5 bg-surface border border-border rounded-lg text-slate-400 hover:text-accent">
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
