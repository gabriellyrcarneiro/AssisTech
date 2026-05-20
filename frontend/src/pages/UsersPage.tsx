import { FormEvent, useEffect, useState } from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { roleLabels } from '../data/labels';
import type { Role, User } from '../types';

const emptyForm = {
  name: '',
  email: '',
  password: '123456',
  role: 'atendente' as Role,
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function loadUsers() {
    setUsers(await apiRequest<User[]>('/users'));
  }

  useEffect(() => {
    loadUsers().catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<User>('/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuario.');
    }
  }

  async function toggleUser(user: User) {
    await apiRequest<User>(`/users/${user._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !user.active }),
    });
    await loadUsers();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Acesso"
        title="Usuarios e perfis"
        description="Cadastre usuarios do sistema e defina perfis de acesso para admin, atendente, tecnico e financeiro."
      />

      {error ? <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form className="panel" onSubmit={handleSubmit}>
          <h2 className="text-lg font-black text-ink">Novo usuario</h2>
          <label className="form-label mt-4">Nome</label>
          <input className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <label className="form-label mt-4">Email</label>
          <input className="form-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label className="form-label mt-4">Senha inicial</label>
          <input className="form-input" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <label className="form-label mt-4">Perfil</label>
          <select className="form-input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="btn-primary mt-4" type="submit">
            <Plus size={17} />
            Criar usuario
          </button>
        </form>

        <section className="panel">
          <h2 className="text-lg font-black text-ink">Equipe cadastrada</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            {users.length ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Perfil</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Acao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3">
                        <strong className="text-ink">{user.name}</strong>
                        <p className="text-xs text-muted">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{roleLabels[user.role]}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn-secondary py-2" type="button" onClick={() => toggleUser(user)}>
                          {user.active ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon={ShieldCheck} title="Nenhum usuario encontrado" text="Crie usuarios para testar o controle de acesso por perfil." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

