import { FormEvent, useEffect, useState } from 'react';
import { Plus, Search, UserRound } from 'lucide-react';
import { apiRequest } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../data/labels';
import type { Customer, Device, ServiceOrder } from '../types';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  document: '',
  address: '',
  notes: '',
};

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState<{
    customer: Customer;
    devices: Device[];
    orders: ServiceOrder[];
  } | null>(null);
  const [error, setError] = useState('');

  async function loadCustomers() {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    setCustomers(await apiRequest<Customer[]>(`/customers${params}`));
  }

  useEffect(() => {
    loadCustomers().catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente.');
    }
  }

  async function openCustomer(customer: Customer) {
    const detail = await apiRequest<{ customer: Customer; devices: Device[]; orders: ServiceOrder[] }>(`/customers/${customer._id}`);
    setSelected(detail);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Atendimento"
        title="Clientes"
        description="Cadastre clientes e consulte o historico de aparelhos e ordens vinculadas a cada pessoa."
      />

      {error ? <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="panel" onSubmit={handleSubmit}>
          <h2 className="text-lg font-black text-ink">Novo cliente</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Nome</label>
              <input className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <label className="form-label">Telefone</label>
              <input className="form-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div>
              <label className="form-label">CPF</label>
              <input className="form-input" value={form.document} onChange={(event) => setForm({ ...form, document: event.target.value })} />
            </div>
          </div>
          <label className="form-label mt-4">Endereco</label>
          <input className="form-input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          <label className="form-label mt-4">Observacoes</label>
          <textarea className="form-input min-h-24" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          <button className="btn-primary mt-4" type="submit">
            <Plus size={17} />
            Salvar cliente
          </button>
        </form>

        <section className="panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-black text-ink">Clientes cadastrados</h2>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                loadCustomers().catch((err) => setError(err.message));
              }}
            >
              <input className="form-input min-w-0 md:w-64" placeholder="Buscar cliente" value={search} onChange={(event) => setSearch(event.target.value)} />
              <button className="btn-secondary" type="submit" aria-label="Buscar cliente">
                <Search size={17} />
              </button>
            </form>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            {customers.length ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="cursor-pointer hover:bg-slate-50" onClick={() => openCustomer(customer)}>
                      <td className="px-4 py-3">
                        <strong className="text-ink">{customer.name}</strong>
                        <p className="text-xs text-muted">{customer.document || 'Documento nao informado'}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{customer.phone}</p>
                        <p className="text-xs text-muted">{customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(customer.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon={UserRound} title="Nenhum cliente encontrado" text="Cadastre um cliente para abrir aparelhos e ordens de servico." />
            )}
          </div>
        </section>
      </div>

      {selected ? (
        <section className="panel mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-primary-600">Historico do cliente</p>
              <h2 className="mt-1 text-2xl font-black text-ink">{selected.customer.name}</h2>
              <p className="mt-1 text-sm text-muted">{selected.customer.phone}</p>
            </div>
            <button className="btn-secondary" onClick={() => setSelected(null)}>
              Fechar
            </button>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="font-black text-ink">Aparelhos</h3>
              <div className="mt-3 space-y-3">
                {selected.devices.map((device) => (
                  <div key={device._id} className="rounded-lg border border-slate-200 p-3">
                    <strong className="text-sm text-ink">
                      {device.brand} {device.model}
                    </strong>
                    <p className="text-sm text-muted">{device.problemDescription}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-black text-ink">Ordens</h3>
              <div className="mt-3 space-y-3">
                {selected.orders.map((order) => (
                  <div key={order._id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-ink">{order.code}</strong>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted">{order.device?.brand} {order.device?.model}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

