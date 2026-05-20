import { FormEvent, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Banknote, CheckCircle2, ClipboardCheck, ClipboardList, PackageCheck, Save, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { apiRequest } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, formatMoney, statusOptions } from '../data/labels';
import { useAuth } from '../context/AuthContext';
import type { OrderStatus, ServiceOrder } from '../types';

export function OrderDetailPage() {
  const { id } = useParams();
  const { can } = useAuth();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<OrderStatus>('entrada');
  const [diagnosis, setDiagnosis] = useState('');
  const [budget, setBudget] = useState({ description: '', partsValue: '0', laborValue: '0' });
  const [rejectionReason, setRejectionReason] = useState('');
  const [execution, setExecution] = useState({ notes: '', completed: false });
  const [payment, setPayment] = useState({ method: 'pix', amountPaid: '0' });
  const [delivery, setDelivery] = useState({ deliveredTo: '', notes: '' });

  async function loadOrder() {
    if (!id) return;
    const data = await apiRequest<ServiceOrder>(`/orders/${id}`);
    setOrder(data);
    setStatus(data.status);
    setDiagnosis(data.diagnosis?.description || '');
    setBudget({
      description: data.budget?.description || '',
      partsValue: String(data.budget?.partsValue || 0),
      laborValue: String(data.budget?.laborValue || 0),
    });
    setExecution({ notes: data.execution?.notes || '', completed: Boolean(data.execution?.completedAt) });
    setPayment({ method: data.payment?.method || 'pix', amountPaid: String(data.payment?.amountPaid || data.budget?.totalValue || 0) });
    setDelivery({ deliveredTo: data.delivery?.deliveredTo || data.customer?.name || '', notes: data.delivery?.notes || '' });
  }

  useEffect(() => {
    loadOrder().catch((err) => setError(err.message));
  }, [id]);

  async function submit(path: string, body: unknown) {
    setError('');
    try {
      const updated = await apiRequest<ServiceOrder>(`/orders/${id}${path}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel salvar.');
    }
  }

  if (!order) {
    return <div className="text-sm font-bold text-muted">Carregando ordem...</div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Detalhe da ordem"
        title={`${order.code} - ${order.customer?.name}`}
        description={`${order.device?.brand} ${order.device?.model} • ${order.device?.problemDescription}`}
        action={
          <Link className="btn-secondary" to="/ordens">
            <ArrowLeft size={17} />
            Voltar
          </Link>
        }
      />

      {error ? <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <section className="panel">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-ink">Resumo</h2>
              <StatusBadge status={order.status} />
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-black text-slate-500">Cliente</dt>
                <dd className="text-slate-700">{order.customer?.name}</dd>
              </div>
              <div>
                <dt className="font-black text-slate-500">Aparelho</dt>
                <dd className="text-slate-700">
                  {order.device?.brand} {order.device?.model}
                </dd>
              </div>
              <div>
                <dt className="font-black text-slate-500">Valor</dt>
                <dd className="text-slate-700">{formatMoney(order.budget?.totalValue || 0)}</dd>
              </div>
              <div>
                <dt className="font-black text-slate-500">Pagamento</dt>
                <dd className="text-slate-700">{order.payment?.status || 'pendente'}</dd>
              </div>
            </dl>

            <form
              className="mt-5"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                submit('/status', { status, note: 'Atualizacao manual do status.' });
              }}
            >
              <label className="form-label">Alterar status</label>
              <select className="form-input" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="btn-secondary mt-3 w-full" type="submit">
                <Save size={17} />
                Atualizar status
              </button>
            </form>
          </section>

          <section className="panel">
            <h2 className="text-lg font-black text-ink">Historico</h2>
            <div className="mt-4 space-y-3">
              {order.history?.map((item, index) => (
                <div key={`${item.action}-${index}`} className="border-l-4 border-primary-100 pl-3">
                  <p className="text-sm font-black text-ink">{item.action}</p>
                  <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
                  {item.note ? <p className="mt-1 text-sm text-slate-600">{item.note}</p> : null}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="grid gap-6">
          {can('admin', 'tecnico') ? (
            <ActionPanel
              icon={ClipboardCheck}
              title="Diagnostico tecnico"
              description="Registre a avaliacao tecnica do defeito informado pelo cliente."
              onSubmit={() => submit('/diagnosis', { description: diagnosis })}
            >
              <label className="form-label">Diagnostico</label>
              <textarea className="form-input min-h-28" value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} />
            </ActionPanel>
          ) : null}

          {can('admin', 'tecnico') ? (
            <ActionPanel
              icon={ClipboardList}
              title="Orcamento"
              description="Informe mao de obra, pecas e valor total para aprovacao do cliente."
              onSubmit={() =>
                submit('/budget', {
                  description: budget.description,
                  partsValue: Number(budget.partsValue),
                  laborValue: Number(budget.laborValue),
                })
              }
            >
              <label className="form-label">Descricao do orcamento</label>
              <textarea className="form-input min-h-24" value={budget.description} onChange={(event) => setBudget({ ...budget, description: event.target.value })} />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Pecas</label>
                  <input className="form-input" type="number" value={budget.partsValue} onChange={(event) => setBudget({ ...budget, partsValue: event.target.value })} />
                </div>
                <div>
                  <label className="form-label">Mao de obra</label>
                  <input className="form-input" type="number" value={budget.laborValue} onChange={(event) => setBudget({ ...budget, laborValue: event.target.value })} />
                </div>
              </div>
            </ActionPanel>
          ) : null}

          {can('admin', 'atendente') ? (
            <div className="panel">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-600" size={22} />
                <div>
                  <h2 className="text-lg font-black text-ink">Aprovacao do cliente</h2>
                  <p className="text-sm text-muted">Registre se o cliente aprovou ou recusou o orcamento.</p>
                </div>
              </div>
              <label className="form-label mt-4">Motivo da rejeicao</label>
              <input className="form-input" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} />
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary" type="button" onClick={() => submit('/budget/decision', { approved: true })}>
                  Aprovar
                </button>
                <button className="btn-secondary" type="button" onClick={() => submit('/budget/decision', { approved: false, rejectionReason })}>
                  Rejeitar
                </button>
              </div>
            </div>
          ) : null}

          {can('admin', 'tecnico') ? (
            <ActionPanel
              icon={Wrench}
              title="Execucao do servico"
              description="Atualize o andamento tecnico e marque quando o reparo estiver finalizado."
              onSubmit={() => submit('/execution', execution)}
            >
              <label className="form-label">Observacoes da execucao</label>
              <textarea className="form-input min-h-24" value={execution.notes} onChange={(event) => setExecution({ ...execution, notes: event.target.value })} />
              <label className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <input type="checkbox" checked={execution.completed} onChange={(event) => setExecution({ ...execution, completed: event.target.checked })} />
                Servico finalizado
              </label>
            </ActionPanel>
          ) : null}

          {can('admin', 'financeiro') ? (
            <ActionPanel
              icon={Banknote}
              title="Pagamento"
              description="Registre pagamentos parciais ou quitacao da ordem de servico."
              onSubmit={() => submit('/payment', { method: payment.method, amountPaid: Number(payment.amountPaid) })}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Metodo</label>
                  <select className="form-input" value={payment.method} onChange={(event) => setPayment({ ...payment, method: event.target.value })}>
                    <option value="pix">Pix</option>
                    <option value="cartao">Cartao</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Valor pago</label>
                  <input className="form-input" type="number" value={payment.amountPaid} onChange={(event) => setPayment({ ...payment, amountPaid: event.target.value })} />
                </div>
              </div>
            </ActionPanel>
          ) : null}

          {can('admin', 'atendente') ? (
            <ActionPanel
              icon={PackageCheck}
              title="Entrega do aparelho"
              description="Confirme a retirada do equipamento e encerre o atendimento."
              onSubmit={() => submit('/delivery', delivery)}
            >
              <label className="form-label">Entregue para</label>
              <input className="form-input" value={delivery.deliveredTo} onChange={(event) => setDelivery({ ...delivery, deliveredTo: event.target.value })} />
              <label className="form-label mt-4">Observacoes</label>
              <textarea className="form-input min-h-20" value={delivery.notes} onChange={(event) => setDelivery({ ...delivery, notes: event.target.value })} />
            </ActionPanel>
          ) : null}
        </section>
      </div>
    </div>
  );
}

type ActionPanelProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: () => void;
};

function ActionPanel({ icon: Icon, title, description, children, onSubmit }: ActionPanelProps) {
  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-center gap-3">
        <Icon className="text-primary-600" size={22} />
        <div>
          <h2 className="text-lg font-black text-ink">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
      <button className="btn-primary mt-4" type="submit">
        <Save size={17} />
        Salvar
      </button>
    </form>
  );
}
