import { useState } from 'react'
import { useApp } from './context/AppContext'
import { Topbar, BottomNav } from './components/UI'
import Login      from './pages/Login'
import Home       from './pages/Home'
import Cadastro   from './pages/Cadastro'
import Aprovacao  from './pages/Aprovacao'
import Emprestimos from './pages/Emprestimos'
import Gestores   from './pages/Gestores'

export default function App() {
  const { usuario, logout } = useApp()
  const [aba, setAba] = useState('home')

  if (!usuario) return <Login />

  // Tabs baseadas no grupo
  const tabs = [
    { id:'home',        label:'Início',      icon:'🏠' },
    { id:'cadastro',    label:'Cadastrar',   icon:'➕' },
    usuario.grupo === 'E' && { id:'aprovacao', label:'Aprovação', icon:'✅' },
    usuario.grupo === 'E' && { id:'emprestimos', label:'Contratos', icon:'💰' },
    { id:'gestores',    label:'Perfil',      icon:'👤' },
  ].filter(Boolean)

  const pages = {
    home:        <Home />,
    cadastro:    <Cadastro />,
    aprovacao:   <Aprovacao />,
    emprestimos: <Emprestimos />,
    gestores:    <Gestores />,
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto">
      <Topbar usuario={usuario} onLogout={logout} />
      <div className="flex-1 overflow-y-auto pb-20">
        {pages[aba] || <Home />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <BottomNav aba={aba} setAba={setAba} tabs={tabs} />
      </div>
    </div>
  )
}
