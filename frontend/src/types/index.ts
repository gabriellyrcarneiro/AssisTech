export type Role = 'admin' | 'atendente' | 'tecnico' | 'financeiro';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  document?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
};

export type Device = {
  _id: string;
  customer: Customer;
  type: 'celular' | 'notebook' | 'tablet' | 'outro';
  brand: string;
  model: string;
  serialNumber?: string;
  imei?: string;
  condition?: string;
  accessories?: string;
  problemDescription: string;
};

export type OrderStatus =
  | 'entrada'
  | 'diagnostico'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'rejeitado'
  | 'em_execucao'
  | 'aguardando_pagamento'
  | 'pago'
  | 'entregue'
  | 'cancelado';

export type ServiceOrder = {
  _id: string;
  code: string;
  customer: Customer;
  device: Device;
  status: OrderStatus;
  priority: 'baixa' | 'normal' | 'alta' | 'urgente';
  intakeNotes?: string;
  diagnosis?: {
    description?: string;
    technician?: User;
    completedAt?: string;
  };
  budget?: {
    description?: string;
    partsValue?: number;
    laborValue?: number;
    totalValue?: number;
    approved?: boolean | null;
    decidedAt?: string;
    rejectionReason?: string;
  };
  execution?: {
    notes?: string;
    technician?: User;
    completedAt?: string;
  };
  payment?: {
    status?: 'pendente' | 'parcial' | 'pago';
    method?: string;
    amountPaid?: number;
    paidAt?: string;
  };
  delivery?: {
    deliveredAt?: string;
    deliveredTo?: string;
    notes?: string;
  };
  history: Array<{
    action: string;
    fromStatus?: string;
    toStatus?: string;
    note?: string;
    createdAt: string;
    user?: User;
  }>;
  createdAt: string;
};

export type DashboardData = {
  totals: {
    customers: number;
    devices: number;
    users: number;
    orders: number;
    revenue: number;
  };
  byStatus: Array<{ status: OrderStatus; total: number }>;
  byPriority: Array<{ priority: string; total: number }>;
  recentOrders: ServiceOrder[];
};

