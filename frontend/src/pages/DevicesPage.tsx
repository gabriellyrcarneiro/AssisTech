import { FormEvent, useEffect, useState } from 'react';
import { Laptop, Plus, Search } from 'lucide-react';
import { apiRequest } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { Customer, Device } from '../types';

const emptyForm = {
  customer: '',
  type: 'celular',
  brand: '',
  model: '',
  serialNumber: '',
  imei: '',
  condition: '',
  accessories: '',
  problemDescription: '',
};

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function loadDevices() {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    setDevices(await apiRequest<Device[]>(`/devices${params}`));
  }

  useEffect(() => {
    Promise.all([loadDevices(), apiRequest<Customer[]>('/customers').then(setCustomers)]).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiRequest<Device>('/devices', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({ ...emptyForm, customer: form.customer });
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aparelho.');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Equipamentos"
        title="Aparelhos"
        description="Registre celulares, notebooks e outros equipamentos recebidos pela assistencia tecnica."
      />

      {error ? <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="panel" onSubmit={handleSubmit}>
          <h2 className="text-lg font-black text-ink">Novo aparelho</h2>
          <label className="form-label mt-4">Cliente</label>
          <select className="form-input" value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })}>
            <option value="">Selecione</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Tipo</label>
              <select className="form-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="celular">Celular</option>
                <option value="notebook">Notebook</option>
                <option value="tablet">Tablet</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="form-label">Marca</label>
              <input className="form-input" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
            </div>
            <div>
              <label className="form-label">Modelo</label>
              <input className="form-input" value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} />
            </div>
            <div>
              <label className="form-label">IMEI</label>
              <input className="form-input" value={form.imei} onChange={(event) => setForm({ ...form, imei: event.target.value })} />
            </div>
            <div>
              <label className="form-label">Numero de serie</label>
              <input className="form-input" value={form.serialNumber} onChange={(event) => setForm({ ...form, serialNumber: event.target.value })} />
            </div>
            <div>
              <label className="form-label">Acessorios</label>
              <input className="form-input" value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value })} />
            </div>
          </div>

          <label className="form-label mt-4">Estado fisico</label>
          <textarea className="form-input min-h-20" value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })} />
          <label className="form-label mt-4">Problema relatado</label>
          <textarea
            className="form-input min-h-24"
            value={form.problemDescription}
            onChange={(event) => setForm({ ...form, problemDescription: event.target.value })}
          />
          <button className="btn-primary mt-4" type="submit">
            <Plus size={17} />
            Salvar aparelho
          </button>
        </form>

        <section className="panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-black text-ink">Aparelhos cadastrados</h2>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                loadDevices().catch((err) => setError(err.message));
              }}
            >
              <input className="form-input min-w-0 md:w-64" placeholder="Buscar aparelho" value={search} onChange={(event) => setSearch(event.target.value)} />
              <button className="btn-secondary" type="submit" aria-label="Buscar aparelho">
                <Search size={17} />
              </button>
            </form>
          </div>

          <div className="mt-4 grid gap-3">
            {devices.length ? (
              devices.map((device) => (
                <article key={device._id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-primary-600">{device.type}</p>
                      <h3 className="mt-1 text-lg font-black text-ink">
                        {device.brand} {device.model}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{device.customer?.name}</p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {device.imei || device.serialNumber || 'Sem codigo'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{device.problemDescription}</p>
                </article>
              ))
            ) : (
              <EmptyState icon={Laptop} title="Nenhum aparelho encontrado" text="Cadastre aparelhos para abrir ordens de servico." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

