import { FormEvent, useState } from 'react';
import { KeyRound, LogIn, ShieldCheck, Wrench } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  ['admin@assistech.com', 'admin'],
  ['atendente@assistech.com', 'atendente'],
  ['tecnico@assistech.com', 'tecnico'],
  ['financeiro@assistech.com', 'financeiro'],
];

export function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@assistech.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface p-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden rounded-lg bg-primary-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-primary-700">
            <Wrench size={30} />
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight">AssisTech</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-primary-100">
            Sistema web para organizar clientes, aparelhos e ordens de servico em assistencias tecnicas de
            celulares e notebooks.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">JWT</strong>
            <span className="text-sm text-primary-100">Autenticacao</span>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">MongoDB</strong>
            <span className="text-sm text-primary-100">Banco de dados</span>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">Perfis</strong>
            <span className="text-sm text-primary-100">Controle de acesso</span>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-2">
        <form className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-50 text-primary-700">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink">Entrar no sistema</h2>
              <p className="text-sm text-muted">Use uma conta demo para acessar o painel.</p>
            </div>
          </div>

          {error ? <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div> : null}

          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input id="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} />

          <label className="form-label mt-4" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="btn-primary mt-5 w-full" type="submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Entrando...' : 'Acessar painel'}
          </button>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-ink">
              <KeyRound size={17} />
              Contas de demonstracao
            </div>
            <div className="mt-3 space-y-2">
              {demoAccounts.map(([account, role]) => (
                <button
                  key={account}
                  className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-left text-sm text-slate-700"
                  type="button"
                  onClick={() => {
                    setEmail(account);
                    setPassword('123456');
                  }}
                >
                  <span>{account}</span>
                  <strong>{role}</strong>
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
