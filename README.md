# CredPlus App

Sistema completo de gestão de empréstimos.

## Instalação

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Faça push para o GitHub
2. Acesse vercel.com e importe o repositório
3. Clique em Deploy — pronto!

## Usuários de demonstração (senha: 1234)

| Usuário  | Grupo    | Acesso  |
|----------|----------|---------|
| lellys   | Especial | Total   |
| jailton  | A        | Visual  |
| ricardo  | A        | Visual  |
| mangu    | A        | Visual  |
| matheus  | A        | Visual  |
| sanny    | B        | Visual  |
| marcos   | B        | Visual  |
| jean     | B        | Visual  |

## Estrutura

```
src/
  context/
    AppContext.jsx   — Estado global (gestores, clientes, empréstimos)
  components/
    UI.jsx           — Componentes reutilizáveis
  pages/
    Login.jsx        — Tela de login
    Home.jsx         — Dashboard
    Cadastro.jsx     — Cadastrar clientes
    Aprovacao.jsx    — Fila de aprovação (Grupo E)
    Emprestimos.jsx  — Contratos ativos
    Gestores.jsx     — Gestão de gestores + Perfil
```
