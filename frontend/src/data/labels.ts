import type { OrderStatus, Role } from '../types';

export const statusLabels: Record<OrderStatus, string> = {
  entrada: 'Entrada',
  diagnostico: 'Diagnostico',
  aguardando_aprovacao: 'Aguardando aprovacao',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  em_execucao: 'Em execucao',
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const roleLabels: Record<Role, string> = {
  admin: 'Administrador',
  atendente: 'Atendente',
  tecnico: 'Tecnico',
  financeiro: 'Financeiro',
};

export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

export function formatMoney(value = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

