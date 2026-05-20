# Roteiro de apresentacao - AssisTech

## Tempo sugerido

Uma apresentacao de 7 a 10 minutos funciona bem:

1. Problema e objetivo: 1 minuto.
2. Tecnologias usadas: 1 minuto.
3. Demonstracao do fluxo: 4 a 6 minutos.
4. GitHub, deploy e conclusao: 1 minuto.

## Fala inicial

"O projeto se chama AssisTech. Ele foi desenvolvido como uma aplicacao full stack para gestao de assistencias tecnicas de celulares e notebooks. A motivacao foi uma situacao comum em assistencias pequenas: informacoes de clientes, aparelhos e ordens ficam espalhadas em cadernos, planilhas ou mensagens. O sistema organiza esse fluxo em uma plataforma web."

## Pontos tecnicos

- Frontend com React, Vite, TypeScript, Tailwind CSS, React Router e Recharts.
- Backend com Node.js, Express, MongoDB e Mongoose.
- Autenticacao com JWT.
- Senhas criptografadas com bcryptjs no modo MongoDB.
- Controle de acesso por perfil.
- API REST separada da interface.
- Deploy preparado para Vercel com API serverless.
- Modo demo para apresentacao quando nao houver MongoDB Atlas configurado.

## Ordem da demonstracao

1. Login
   - Mostre a tela de login.
   - Explique as contas por perfil: admin, atendente, tecnico e financeiro.

2. Dashboard
   - Mostre os cards de clientes, aparelhos, ordens e receita.
   - Mostre o grafico de ordens por status.
   - Explique que os dados vem do backend.

3. Clientes
   - Cadastre um cliente.
   - Use a busca.
   - Clique em um cliente e mostre o historico.

4. Aparelhos
   - Cadastre um celular ou notebook.
   - Mostre marca, modelo, IMEI/serie e problema relatado.

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

9. GitHub e Vercel
   - Mostre o repositorio.
   - Abra o historico de commits.
   - Mostre o link publicado na Vercel: https://assistech-eight.vercel.app.

## Comandos uteis

```bash
npm install
npm run seed
npm run dev
npm run check
npx vercel --prod
```

## Plano B

- Se o MongoDB local nao estiver rodando, use o modo demo ou configure MongoDB Atlas.
- Se o deploy estiver sem `MONGODB_URI`, explique que ele usa dados em memoria para manter a apresentacao funcional.
- Se esquecer a senha das contas demo, todas usam `123456`.
- Se o professor pedir arquitetura, mostre `backend/src/models`, `backend/src/routes`, `backend/src/controllers` e `frontend/src/pages`.

## Fechamento

"Com o AssisTech, consegui praticar uma aplicacao full stack completa, com separacao entre frontend e backend, autenticacao, banco de dados, API REST, controle por perfil, deploy e uma interface pensada para um fluxo real de assistencia tecnica."
