# AssisTech

Sistema web para gestao de assistencias tecnicas de celulares e notebooks.

O AssisTech centraliza clientes, aparelhos e ordens de servico em uma aplicacao full stack. A ideia e substituir controles espalhados em cadernos, planilhas e mensagens por um fluxo organizado: entrada do equipamento, diagnostico, orcamento, aprovacao, execucao, pagamento e entrega.

## Funcionalidades

- Login com autenticacao JWT.
- Cadastro de usuarios e controle de acesso por perfil.
- Cadastro e busca de clientes.
- Cadastro e consulta de aparelhos.
- Abertura de ordens de servico.
- Controle de status da ordem.
- Registro de diagnostico tecnico.
- Registro de orcamento.
- Aprovacao ou rejeicao de orcamento.
- Controle de execucao do servico.
- Registro de pagamentos.
- Confirmacao de entrega do aparelho.
- Historico de atendimento por cliente.
- Dashboard com dados do banco e grafico por status.

## Perfis de usuario

- `admin`: acesso geral ao sistema.
- `atendente`: cadastro de clientes, aparelhos, abertura de OS, aprovacao/rejeicao e entrega.
- `tecnico`: diagnostico, orcamento e execucao do servico.
- `financeiro`: pagamento e acompanhamento financeiro.

## Tecnologias

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Recharts
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv

## Como executar

### 1. Instalar dependencias

```bash
npm install
npm run install:all
```

### 2. Configurar variaveis de ambiente

Crie `backend/.env` com base no arquivo `backend/.env.example`:

```bash
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/assistech
JWT_SECRET=troque-esta-chave-em-producao
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Crie `frontend/.env` com base no arquivo `frontend/.env.example`:

```bash
VITE_API_URL=http://localhost:3333/api
```

### 3. Popular o banco com dados de teste

Com o MongoDB ligado, rode:

```bash
npm run seed
```

### 4. Rodar frontend e backend

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3333/api/health`

## Contas demo

Todas usam a senha `123456`.

| Perfil | Email |
| --- | --- |
| Admin | admin@assistech.com |
| Atendente | atendente@assistech.com |
| Tecnico | tecnico@assistech.com |
| Financeiro | financeiro@assistech.com |

## Estrutura

```text
assistech/
  backend/
    src/
      controllers/
      middleware/
      models/
      routes/
      server.js
      seed.js
  frontend/
    src/
      api/
      components/
      context/
      layouts/
      pages/
      types/
```

## Fluxo sugerido para testar

1. Entre como `admin@assistech.com`.
2. Veja os numeros no dashboard.
3. Cadastre um cliente.
4. Cadastre um aparelho para esse cliente.
5. Abra uma ordem de servico.
6. Entre como tecnico e registre diagnostico, orcamento e execucao.
7. Entre como atendente e aprove ou rejeite o orcamento.
8. Entre como financeiro e registre pagamento.
9. Entre como atendente e confirme a entrega.

## Autora

Gabrielly Rodrigues

