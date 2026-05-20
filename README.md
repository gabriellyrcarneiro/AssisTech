# AssisTech

Sistema web para **gestao de assistencias tecnicas de celulares e notebooks.**

O AssisTech foi desenvolvido como **projeto academico full stack** para organizar um problema comum em assistencias pequenas: informacoes importantes ficam espalhadas em cadernos, planilhas, mensagens e anotacoes soltas. A aplicacao centraliza clientes, aparelhos, ordens de servico, diagnosticos, orcamentos, pagamentos e entregas em um unico fluxo web.

## Links

- Repositorio: [github.com/gabriellyrcarneiro/AssisTech](https://github.com/gabriellyrcarneiro/AssisTech)
- Deploy Vercel: [assistech-eight.vercel.app](https://assistech-eight.vercel.app)

## Objetivo

Construir uma aplicacao completa, separando frontend e backend, com autenticacao, rotas de API, banco de dados, controle de perfil e interface voltada para uso real. O projeto nao pretende substituir um sistema comercial completo, mas resolve o controle basico de uma assistencia tecnica de forma pratica e apresentavel.

## Prints do projeto

<p align="center">
  <img width="220" alt="Captura de tela 2026-05-20 041029" src="https://github.com/user-attachments/assets/612ce6a3-27e0-4572-ac10-9e975727827f" />
  <img width="220" height="744" alt="Captura de tela 2026-05-20 041052" src="https://github.com/user-attachments/assets/b569541f-4226-4382-8c15-bb85e8dd2d9e" />
</p>

<p align="center">
  <img width="1599" height="744" alt="Captura de tela 2026-05-20 041117" src="https://github.com/user-attachments/assets/cdb18be0-4d5b-4f91-a3b6-b1861179afd8" />
  <img width="1580" height="743" alt="Captura de tela 2026-05-20 041142" src="https://github.com/user-attachments/assets/4e0b262f-ba71-4e92-9781-d3bad4a28778" />
</p>

## Funcionalidades

- Login com autenticacao JWT.
- Cadastro de usuarios e controle de acesso por perfil.
- Cadastro, busca e historico de clientes.
- Cadastro e consulta de aparelhos.
- Abertura e listagem de ordens de servico.
- Filtros por busca e status.
- Controle de status da ordem.
- Registro de diagnostico tecnico.
- Registro de orcamento.
- Aprovacao ou rejeicao de orcamento.
- Controle de execucao do servico.
- Registro de pagamentos.
- Confirmacao de entrega do aparelho.
- Dashboard com totais, receita e grafico por status.
- Integracao com MongoDB usando Mongoose.
- Modo demo para deploy na Vercel sem banco externo.

## Perfis de usuario

| Perfil | Acesso principal |
| --- | --- |
| `admin` | Acesso geral ao sistema, usuarios e todo o fluxo de OS |
| `atendente` | Clientes, aparelhos, abertura de OS, aprovacao e entrega |
| `tecnico` | Diagnostico, orcamento e execucao do servico |
| `financeiro` | Pagamentos e acompanhamento financeiro |

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

### Deploy

- Vercel para hospedagem do frontend e da API serverless.
- Modo `mongodb` quando `MONGODB_URI` esta configurada.
- Modo `demo` quando nao ha `MONGODB_URI`, com dados em memoria para apresentacao.

## Estrutura do projeto

```text
assistech/
  api/
    index.js
  backend/
    src/
      config/
      controllers/
      demo/
      middleware/
      models/
      routes/
      app.js
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

## Como executar localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Crie `backend/.env` com base em `backend/.env.example`:

```bash
PORT=3333
MONGODB_URI=mongodb://127.0.0.1:27017/assistech
JWT_SECRET=troque-esta-chave-em-producao
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Crie `frontend/.env` com base em `frontend/.env.example`:

```bash
VITE_API_URL=http://localhost:3333/api
```

### 3. Popular o banco

Com o MongoDB ligado, rode:

```bash
npm run seed
```

### 4. Rodar o sistema

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333/api/health`

## Contas demo

Todas usam a senha `123456`.

| Perfil | Email |
| --- | --- |
| Admin | `admin@assistech.com` |
| Atendente | `atendente@assistech.com` |
| Tecnico | `tecnico@assistech.com` |
| Financeiro | `financeiro@assistech.com` |

## Publicacao na Vercel

O projeto possui `vercel.json` e uma funcao serverless em `api/index.js`.

Para publicar:

```bash
npx vercel --prod
```

Sem `MONGODB_URI` configurada na Vercel, a API entra automaticamente em modo demo. Nesse modo, o link fica funcional para apresentacao, login e navegacao, mas os dados ficam em memoria e podem reiniciar.

Para usar MongoDB Atlas em producao, configure estas variaveis na Vercel:

```bash
MONGODB_URI=sua-string-do-mongodb-atlas
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=7d
CLIENT_URL=https://seu-projeto.vercel.app
```

## Validacao

Comando usado para validar backend e frontend:

```bash
npm run check
```

Esse comando executa a checagem do backend e o build de producao do frontend.

## Fluxo sugerido para testar

1. Entre como `admin@assistech.com`.
2. Veja os totais e graficos no dashboard.
3. Cadastre um cliente.
4. Cadastre um aparelho para esse cliente.
5. Abra uma ordem de servico.
6. Registre diagnostico e orcamento como tecnico ou admin.
7. Aprove ou rejeite o orcamento como atendente ou admin.
8. Finalize a execucao do servico.
9. Registre o pagamento como financeiro ou admin.
10. Confirme a entrega como atendente ou admin.

## Historico de commits

O desenvolvimento foi separado em commits semanticos, como:

- `chore: estrutura projeto full stack`
- `feat: implementa API de assistencia tecnica`
- `feat: implementa frontend de gestao`
- `docs: adiciona guia de apresentacao`
- `feat: prepara deploy na vercel`


## Autora

**Gabrielly Rodrigues**
