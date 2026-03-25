// ─── BADGE STATUS ─────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    'VENCIDO': 'bg-red-900/30 text-red-300 border border-red-500',
    'HOJE':    'bg-blue-900/30 text-blue-300 border border-blue-500',
    'AMANHÃ':  'bg-yellow-900/30 text-yellow-300 border border-yellow-500',
    'PAGO':    'bg-green-900/30 text-green-300 border border-green-500',
    'EM DIA':  'bg-blue-900/30 text-blue-300 border border-blue-500',
    'pendente':  'bg-yellow-900/30 text-yellow-300 border border-yellow-500',
    'aprovado':  'bg-green-900/30 text-green-300 border border-green-500',
    'reprovado': 'bg-red-900/30 text-red-300 border border-red-500',
    'ativo':     'bg-green-900/30 text-green-300 border border-green-500',
    'inativo':   'bg-red-900/30 text-red-300 border border-red-500',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${map[status] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({ nome, cor, size = 'md' }) {
  const initials = nome.split(' ').map(w => w[0]).join('').substr(0, 2).toUpperCase()
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-14 h-14 text-lg' }
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-black flex-shrink-0`}
      style={{ background: cor, color: '#0a0f1e' }}>
      {initials}
    </div>
  )
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>}
      <input className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm font-sans transition-colors" {...props} />
    </div>
  )
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>}
      <select className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-slate-100 text-sm" {...props}>
        {children}
      </select>
    </div>
  )
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', onClick, className = '', type = 'button' }) {
  const vars = {
    primary:   'bg-accent text-bg font-black hover:opacity-90',
    outline:   'bg-transparent border border-border text-slate-400 hover:border-slate-500',
    danger:    'bg-transparent border border-red-800 text-red-400 hover:bg-red-900/20',
    warning:   'bg-yellow-900/20 border border-yellow-700 text-yellow-300',
  }
  return (
    <button type={type} onClick={onClick}
      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${vars[variant]} ${className}`}>
      {children}
    </button>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', accent }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl p-4 ${className}`}
      style={accent ? { borderLeft: `3px solid ${accent}` } : {}}>
      {children}
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, color }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="font-outfit text-2xl font-black" style={{ color }}>{value}</div>
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-outfit font-black text-lg text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${checked ? 'bg-accent' : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  )
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
export function Topbar({ usuario, onLogout }) {
  const initials = usuario.nome.split(' ').map(w => w[0]).join('').substr(0, 2).toUpperCase()
  return (
    <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="font-outfit font-black text-xl text-slate-100">
        CRED<span className="text-accent">PLUS</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-bg"
          style={{ background: usuario.cor }}>{initials}</div>
        <span className="text-sm font-semibold text-slate-400 hidden sm:block">{usuario.nome.split(' ')[0]}</span>
        <button onClick={onLogout} className="text-xs text-slate-500 border border-border rounded-lg px-2 py-1 hover:text-slate-300">Sair</button>
      </div>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
export function BottomNav({ aba, setAba, tabs }) {
  return (
    <div className="bg-surface border-t border-border flex sticky bottom-0 z-40">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setAba(t.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${aba === t.id ? 'text-accent' : 'text-slate-600'}`}>
          <span className="text-lg leading-none">{t.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function Empty({ icon, text }) {
  return (
    <div className="text-center py-12 text-slate-600">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-sm">{text}</div>
    </div>
  )
}
