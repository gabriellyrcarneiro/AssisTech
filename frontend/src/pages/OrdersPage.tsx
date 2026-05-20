import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Search } from 'lucide-react';
import { apiRequest } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, statusOptions } from '../data/labels';
import type { Customer, Device, OrderStatus, ServiceOrder } from '../types';

const emptyForm = {
  customer: '',
  device: '',
  priority: 'normal',
  intakeNotes: '',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const availableDevices = useMemo(() => {
    if (!form.customer) {
      return devices;
    }

    return devices.filter((device) => device.customer?._id === form.customer);
  }, [devices, form.customer]);

  async function loadOrders() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    setOrders(await apiRequest<ServiceOrder[]>(`/orders${suffix}`));
  }

  useEffect(() => {
    Promise.all([
      loadOrders(),
      apiRequest<Customer[]>('/customers').then(setCustomers),
      apiRequest<Device[]>('/devices').then(setDevices),
    ]).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<ServiceOrder>('/orders', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao abrir ordem.');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Ordem de servico"
        title="Ordens de servico"
        description="Abra, filtre e acompanhe o andamento dos equipamentos desde a entrada ate a entrega."
      />

      {error ? <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="panel" onSubmit={handleSubmit}>
          <h2 className="text-lg font-black text-ink">Abrir nova OS</h2>
          <label className="form-label mt-4">Cliente</label>
          <select
            className="form-input"
            value={form.customer}
            onChange={(event) => setForm({ ...form, customer: event.target.value, device: '' })}
          >
            <option value="">Selecione</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>

          <label className="form-label mt-4">Aparelho</label>
          <select className="form-input" value={form.device} onChange={(event) => setForm({ ...form, device: event.target.value })}>
            <option value="">Selecione</option>
            {availableDevices.map((device) => (
              <option key={device._id} value={device._id}>
                {device.brand} {device.model} - {device.customer?.name}
              </option>
            ))}
          </select>

          <label className="form-label mt-4">Prioridade</label>
          <select className="form-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>

          <label className="form-label mt-4">Observacoes de entrada</label>
          <textarea
            className="form-input min-h-28"
            value={form.intakeNotes}
            onChange={(event) => setForm({ ...form, intakeNotes: event.target.value })}
          />

          <button className="btn-primary mt-4" type="submit">
            <Plus size={17} />
            Abrir OS
          </button>
        </form>

        <section className="panel">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-lg font-black text-ink">Listagem</h2>
            <form
              className="grid gap-2 md:grid-cols-[1fr_190px_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                loadOrders().catch((err) => setError(err.message));
              }}
            >
              <input className="form-input" placeholder="Buscar OS" value={search} onChange={(event) => setSearch(event.target.value)} />
              <select className="form-input" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">Todos os status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="btn-secondary" type="submit" aria-label="Buscar ordens">
                <Search size={17} />
              </button>
            </form>
          </div>

          <div className="mt-4 space-y-3">
            {orders.length ? (
              orders.map((order) => (
                <Link key={order._id} to={`/ordens/${order._id}`} className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-primary-200 hover:bg-primary-50/30">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-lg text-ink">{order.code}</strong>
                        <StatusBadge status={order.status as OrderStatus} />
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-700">{order.customer?.name}</p>
                      <p className="text-sm text-muted">
                        {order.device?.brand} {order.device?.model}
                      </p>
                    </div>
                    <div className="text-left text-sm text-muted md:text-right">
                      <p>Prioridade: {order.priority}</p>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState icon={ClipboardList} title="Nenhuma ordem encontrada" text="Abra a primeira ordem de servico para acompanhar o fluxo tecnico." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

