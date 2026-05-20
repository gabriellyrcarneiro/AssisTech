import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Banknote, ClipboardList, MonitorSmartphone, Users } from 'lucide-react';
import { apiRequest } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { formatMoney, statusLabels } from '../data/labels';
import type { DashboardData } from '../types';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest<DashboardData>('/dashboard')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const chartData =
    data?.byStatus.map((item) => ({
      name: statusLabels[item.status],
      total: item.total,
    })) || [];

  return (
    <div>
      <PageHeader
        eyebrow="Visao geral"
        title="Dashboard operacional"
        description="Acompanhe a quantidade de clientes, aparelhos, ordens abertas e faturamento registrado no banco."
      />

      {error ? <div className="mb-4 rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clientes" value={data?.totals.customers ?? 0} helper="Historico centralizado" icon={Users} />
        <StatCard label="Aparelhos" value={data?.totals.devices ?? 0} helper="Celulares e notebooks" icon={MonitorSmartphone} />
        <StatCard label="Ordens" value={data?.totals.orders ?? 0} helper="Fluxo de atendimento" icon={ClipboardList} />
        <StatCard label="Receita" value={formatMoney(data?.totals.revenue ?? 0)} helper="Pagamentos confirmados" icon={Banknote} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel">
          <h2 className="text-lg font-black text-ink">Ordens por status</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#1b7dd8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <h2 className="text-lg font-black text-ink">Ultimas ordens</h2>
          <div className="mt-4 space-y-3">
            {data?.recentOrders.map((order) => (
              <div key={order._id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-ink">{order.code}</strong>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-700">{order.customer?.name}</p>
                <p className="text-xs text-muted">
                  {order.device?.brand} {order.device?.model}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

