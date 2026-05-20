import type { OrderStatus } from '../types';
import { statusLabels } from '../data/labels';

const statusStyles: Record<OrderStatus, string> = {
  entrada: 'bg-slate-100 text-slate-700',
  diagnostico: 'bg-blue-100 text-blue-700',
  aguardando_aprovacao: 'bg-amber-100 text-amber-800',
  aprovado: 'bg-emerald-100 text-emerald-700',
  rejeitado: 'bg-rose-100 text-rose-700',
  em_execucao: 'bg-indigo-100 text-indigo-700',
  aguardando_pagamento: 'bg-orange-100 text-orange-800',
  pago: 'bg-green-100 text-green-700',
  entregue: 'bg-zinc-900 text-white',
  cancelado: 'bg-zinc-200 text-zinc-700',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

