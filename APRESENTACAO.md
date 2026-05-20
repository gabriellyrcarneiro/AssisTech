# Roteiro de apresentacao - AssisTech

## Tempo sugerido

Uma apresentacao de 7 a 10 minutos funciona bem:

1. Problema e objetivo: 1 minuto.
2. Tecnologias usadas: 1 minuto.
3. Demonstracao do fluxo: 4 a 6 minutos.
4. GitHub, commits e conclusao: 1 minuto.

## Fala inicial

"O projeto se chama AssisTech. Ele foi desenvolvido como uma aplicacao full stack para gestao de assistencias tecnicas de celulares e notebooks. A motivacao foi uma situacao comum em assistencias pequenas: informacoes de clientes, aparelhos e ordens ficam espalhadas em cadernos, planilhas ou mensagens. O sistema organiza esse fluxo em uma plataforma web."

## Pontos tecnicos para apresentar

- O frontend foi construido com React, Vite, TypeScript, Tailwind CSS, React Router e Recharts.
- O backend foi desenvolvido com Node.js, Express, MongoDB e Mongoose.
- A autenticacao usa JWT.
- As senhas sao criptografadas com bcryptjs.
- O sistema possui controle de acesso por perfil.
- O dashboard mostra dados reais consultados no banco.

## Ordem da demonstracao

1. Login
   - Mostre a tela de login.
   - Explique as contas por perfil: admin, atendente, tecnico e financeiro.

2. Dashboard
   - Mostre os cards de clientes, aparelhos, ordens e receita.
   - Mostre o grafico de ordens por status.
   - Explique que os dados vem do MongoDB.

3. Clientes
   - Cadastre um cliente.
   - Use a busca.
   - Clique em um cliente e mostre o historico.

4. Aparelhos
   - Cadastre um celular ou notebook.
   - Mostre dados como marca, modelo, IMEI/serie e problema relatado.

5. Ordens de servico
   - Abra uma OS para o cliente e aparelho cadastrados.
   - Mostre a listagem com filtro por status.
   - Entre no detalhe da ordem.

6. Fluxo tecnico
   - Como tecnico ou admin, registre diagnostico.
   - Registre o orcamento.
   - Marque execucao do servico.

7. Aprovacao e financeiro
   - Como atendente, aprove ou rejeite o orcamento.
   - Como financeiro, registre o pagamento.
   - Como atendente, confirme a entrega.

8. Usuarios
   - Como admin, mostre cadastro de usuarios.
   - Explique que cada perfil acessa somente partes do fluxo.

9. GitHub
   - Mostre o repositorio.
   - Abra o historico de commits.
   - Destaque commits semanticos como `feat`, `fix`, `docs` e `chore`.

## Comandos uteis para a demo

```bash
npm install
npm run install:all
npm run seed
npm run dev
```

## Plano B

- Se o MongoDB local nao estiver rodando, use MongoDB Atlas e atualize `MONGODB_URI`.
- Se o navegador bloquear alguma requisicao, confira se `CLIENT_URL` esta como `http://localhost:5173`.
- Se esquecer a senha das contas demo, rode `npm run seed` novamente.
- Se o professor pedir arquitetura, mostre as pastas `backend/src/models`, `backend/src/routes` e `frontend/src/pages`.

## Fechamento

"Com o AssisTech, consegui praticar uma aplicacao full stack completa, com separacao entre frontend e backend, autenticacao, banco de dados, API REST, controle por perfil e uma interface pensada para um fluxo real de assistencia tecnica."

