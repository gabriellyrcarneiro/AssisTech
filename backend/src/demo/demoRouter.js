import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError, notFound } from '../utils/httpError.js';

const password = '123456';

const users = [
  { _id: 'user-admin', name: 'Admin AssisTech', email: 'admin@assistech.com', password, role: 'admin', active: true, createdAt: daysAgo(20) },
  { _id: 'user-atendente', name: 'Atendente Demo', email: 'atendente@assistech.com', password, role: 'atendente', active: true, createdAt: daysAgo(18) },
  { _id: 'user-tecnico', name: 'Tecnico Demo', email: 'tecnico@assistech.com', password, role: 'tecnico', active: true, createdAt: daysAgo(16) },
  { _id: 'user-financeiro', name: 'Financeiro Demo', email: 'financeiro@assistech.com', password, role: 'financeiro', active: true, createdAt: daysAgo(14) },
];

const customers = [
  {
    _id: 'customer-ana',
    name: 'Ana Martins',
    phone: '(11) 98888-1020',
    email: 'ana.martins@email.com',
    document: '123.456.789-10',
    address: 'Rua das Flores, 120',
    notes: 'Prefere contato por WhatsApp.',
    createdAt: daysAgo(12),
  },
  {
    _id: 'customer-lucas',
    name: 'Lucas Ferreira',
    phone: '(21) 97777-4455',
    email: 'lucas.ferreira@email.com',
    document: '987.654.321-00',
    address: 'Av. Central, 455',
    notes: '',
    createdAt: daysAgo(9),
  },
  {
    _id: 'customer-marina',
    name: 'Marina Costa',
    phone: '(31) 96666-8080',
    email: 'marina.costa@email.com',
    document: '456.789.123-77',
    address: 'Rua Horizonte, 44',
    notes: 'Cliente recorrente.',
    createdAt: daysAgo(5),
  },
];

const devices = [
  {
    _id: 'device-iphone',
    customer: 'customer-ana',
    type: 'celular',
    brand: 'Apple',
    model: 'iPhone 12',
    serialNumber: 'APL12-2026',
    imei: '354111222333444',
    condition: 'Tela trincada, aparelho liga normalmente.',
    accessories: 'Sem carregador.',
    problemDescription: 'Tela quebrada apos queda.',
    createdAt: daysAgo(11),
  },
  {
    _id: 'device-dell',
    customer: 'customer-lucas',
    type: 'notebook',
    brand: 'Dell',
    model: 'Inspiron 15',
    serialNumber: 'DLL-5588-BR',
    imei: '',
    condition: 'Carcaca com marcas de uso.',
    accessories: 'Fonte original.',
    problemDescription: 'Notebook lento e aquecendo muito.',
    createdAt: daysAgo(8),
  },
  {
    _id: 'device-samsung',
    customer: 'customer-marina',
    type: 'celular',
    brand: 'Samsung',
    model: 'Galaxy S21',
    serialNumber: 'SMS21-445',
    imei: '351999888777666',
    condition: 'Sem danos aparentes.',
    accessories: 'Capa protetora.',
    problemDescription: 'Bateria descarrega rapidamente.',
    createdAt: daysAgo(4),
  },
];

const orders = [
  {
    _id: 'order-iphone',
    code: 'OS-00001',
    customer: 'customer-ana',
    device: 'device-iphone',
    status: 'pago',
    priority: 'alta',
    intakeNotes: 'Cliente precisa do aparelho para trabalho.',
    createdBy: 'user-atendente',
    diagnosis: {
      description: 'Display danificado, touch funcionando parcialmente.',
      technician: 'user-tecnico',
      completedAt: daysAgo(10),
    },
    budget: {
      description: 'Troca do modulo de tela.',
      partsValue: 420,
      laborValue: 130,
      totalValue: 550,
      approved: true,
      decidedAt: daysAgo(9),
      rejectionReason: '',
    },
    execution: {
      notes: 'Tela substituida e aparelho testado.',
      technician: 'user-tecnico',
      completedAt: daysAgo(7),
    },
    payment: {
      status: 'pago',
      method: 'pix',
      amountPaid: 550,
      paidAt: daysAgo(6),
    },
    delivery: {},
    history: [
      history('OS aberta', '', 'entrada', 'Equipamento recebido na assistencia.', 'user-atendente', 11),
      history('Diagnostico registrado', 'entrada', 'diagnostico', 'Display danificado.', 'user-tecnico', 10),
      history('Orcamento aprovado', 'diagnostico', 'aprovado', 'Cliente aprovou o orcamento.', 'user-atendente', 9),
      history('Servico finalizado', 'aprovado', 'aguardando_pagamento', 'Tela substituida.', 'user-tecnico', 7),
      history('Pagamento registrado', 'aguardando_pagamento', 'pago', 'Pagamento via pix.', 'user-financeiro', 6),
    ],
    createdAt: daysAgo(11),
  },
  {
    _id: 'order-dell',
    code: 'OS-00002',
    customer: 'customer-lucas',
    device: 'device-dell',
    status: 'em_execucao',
    priority: 'normal',
    intakeNotes: 'Verificar lentidao antes de formatar.',
    createdBy: 'user-atendente',
    diagnosis: {
      description: 'Sistema com muitos processos, pasta termica ressecada e cooler sujo.',
      technician: 'user-tecnico',
      completedAt: daysAgo(6),
    },
    budget: {
      description: 'Limpeza interna, troca de pasta termica e otimizacao do sistema.',
      partsValue: 35,
      laborValue: 180,
      totalValue: 215,
      approved: true,
      decidedAt: daysAgo(5),
      rejectionReason: '',
    },
    execution: {
      notes: 'Limpeza concluida, aguardando teste final.',
      technician: 'user-tecnico',
    },
    payment: {
      status: 'pendente',
      amountPaid: 0,
    },
    delivery: {},
    history: [
      history('OS aberta', '', 'entrada', 'Notebook recebido.', 'user-atendente', 8),
      history('Diagnostico registrado', 'entrada', 'diagnostico', 'Superaquecimento identificado.', 'user-tecnico', 6),
      history('Orcamento aprovado', 'diagnostico', 'aprovado', 'Cliente aprovou o reparo.', 'user-atendente', 5),
      history('Servico em execucao', 'aprovado', 'em_execucao', 'Limpeza e testes em andamento.', 'user-tecnico', 2),
    ],
    createdAt: daysAgo(8),
  },
  {
    _id: 'order-samsung',
    code: 'OS-00003',
    customer: 'customer-marina',
    device: 'device-samsung',
    status: 'aguardando_aprovacao',
    priority: 'baixa',
    intakeNotes: 'Cliente autorizou diagnostico inicial.',
    createdBy: 'user-atendente',
    diagnosis: {
      description: 'Bateria com desgaste acima do normal.',
      technician: 'user-tecnico',
      completedAt: daysAgo(3),
    },
    budget: {
      description: 'Substituicao da bateria e teste de carga.',
      partsValue: 160,
      laborValue: 90,
      totalValue: 250,
      approved: null,
    },
    execution: {},
    payment: {
      status: 'pendente',
      amountPaid: 0,
    },
    delivery: {},
    history: [
      history('OS aberta', '', 'entrada', 'Celular recebido para avaliacao.', 'user-atendente', 4),
      history('Diagnostico registrado', 'entrada', 'diagnostico', 'Bateria com desgaste.', 'user-tecnico', 3),
      history('Orcamento registrado', 'diagnostico', 'aguardando_aprovacao', 'Aguardando retorno da cliente.', 'user-tecnico', 2),
    ],
    createdAt: daysAgo(4),
  },
];

export const demoRouter = Router();

demoRouter.post('/auth/login', (request, response, next) => {
  try {
    const { email, password: informedPassword } = request.body;
    const user = users.find((item) => item.email === String(email || '').toLowerCase());

    if (!user || user.password !== informedPassword) {
      throw new HttpError(401, 'Credenciais invalidas.');
    }

    if (!user.active) {
      throw new HttpError(403, 'Usuario desativado.');
    }

    response.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/auth/me', authenticate, (request, response) => {
  response.json({ user: publicUser(request.user) });
});

demoRouter.use(authenticate);

demoRouter.get('/dashboard', (_request, response) => {
  const byStatus = countBy(orders, 'status').map(([status, total]) => ({ status, total }));
  const byPriority = countBy(orders, 'priority').map(([priority, total]) => ({ priority, total }));
  const revenue = orders.reduce((total, order) => total + (order.payment?.status === 'pago' ? Number(order.payment.amountPaid || 0) : 0), 0);

  response.json({
    totals: {
      customers: customers.length,
      devices: devices.length,
      users: users.length,
      orders: orders.length,
      revenue,
    },
    byStatus,
    byPriority,
    recentOrders: orders
      .toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(populateOrder),
  });
});

demoRouter.get('/users', authorize('admin'), (_request, response) => {
  response.json(users.toSorted(byNewest).map(publicUser));
});

demoRouter.post('/users', authorize('admin'), (request, response, next) => {
  try {
    const { name, email, password: newPassword, role } = request.body;

    if (!name || !email || !newPassword || !role) {
      throw new HttpError(400, 'Nome, email, senha e perfil sao obrigatorios.');
    }

    if (users.some((user) => user.email === String(email).toLowerCase())) {
      throw new HttpError(409, 'Ja existe um usuario com este email.');
    }

    const user = {
      _id: nextId('user', users),
      name,
      email: String(email).toLowerCase(),
      password: newPassword,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    response.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/users/:id', authorize('admin'), (request, response, next) => {
  try {
    const user = users.find((item) => item._id === request.params.id);

    if (!user) {
      throw notFound('Usuario nao encontrado.');
    }

    const { name, role, active, password: newPassword } = request.body;
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (active !== undefined) user.active = Boolean(active);
    if (newPassword) user.password = newPassword;

    response.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/customers', (request, response) => {
  const search = normalize(request.query.search);
  const result = customers.filter((customer) =>
    [customer.name, customer.phone, customer.email, customer.document].some((value) => normalize(value).includes(search)),
  );

  response.json(result.toSorted(byNewest));
});

demoRouter.post('/customers', authorize('admin', 'atendente'), (request, response, next) => {
  try {
    const { name, phone } = request.body;

    if (!name || !phone) {
      throw new HttpError(400, 'Nome e telefone sao obrigatorios.');
    }

    const customer = {
      _id: nextId('customer', customers),
      name,
      phone,
      email: request.body.email || '',
      document: request.body.document || '',
      address: request.body.address || '',
      notes: request.body.notes || '',
      createdAt: new Date().toISOString(),
    };

    customers.push(customer);
    response.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/customers/:id', (request, response, next) => {
  try {
    const customer = findCustomer(request.params.id);
    const customerDevices = devices.filter((device) => device.customer === customer._id).map(populateDevice);
    const customerOrders = orders.filter((order) => order.customer === customer._id).toSorted(byNewest).map(populateOrder);

    response.json({ customer, devices: customerDevices, orders: customerOrders });
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/devices', (request, response) => {
  const search = normalize(request.query.search);
  const customer = request.query.customer;
  const result = devices.filter((device) => {
    const matchesCustomer = customer ? device.customer === customer : true;
    const matchesSearch = [device.brand, device.model, device.imei, device.serialNumber].some((value) => normalize(value).includes(search));
    return matchesCustomer && matchesSearch;
  });

  response.json(result.toSorted(byNewest).map(populateDevice));
});

demoRouter.post('/devices', authorize('admin', 'atendente'), (request, response, next) => {
  try {
    const { customer, type, brand, model, problemDescription } = request.body;

    if (!customer || !type || !brand || !model || !problemDescription) {
      throw new HttpError(400, 'Cliente, tipo, marca, modelo e problema sao obrigatorios.');
    }

    findCustomer(customer);

    const device = {
      _id: nextId('device', devices),
      customer,
      type,
      brand,
      model,
      serialNumber: request.body.serialNumber || '',
      imei: request.body.imei || '',
      condition: request.body.condition || '',
      accessories: request.body.accessories || '',
      problemDescription,
      createdBy: request.user._id,
      createdAt: new Date().toISOString(),
    };

    devices.push(device);
    response.status(201).json(populateDevice(device));
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/devices/:id', (request, response, next) => {
  try {
    response.json(populateDevice(findDevice(request.params.id)));
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/orders', (request, response) => {
  const search = normalize(request.query.search);
  const { status, customer } = request.query;
  const result = orders.filter((order) => {
    const orderCustomer = customers.find((item) => item._id === order.customer);
    const orderDevice = devices.find((item) => item._id === order.device);
    const matchesStatus = status ? order.status === status : true;
    const matchesCustomer = customer ? order.customer === customer : true;
    const matchesSearch = [order.code, order.intakeNotes, orderCustomer?.name, orderDevice?.brand, orderDevice?.model].some((value) =>
      normalize(value).includes(search),
    );

    return matchesStatus && matchesCustomer && matchesSearch;
  });

  response.json(result.toSorted(byNewest).map(populateOrder));
});

demoRouter.post('/orders', authorize('admin', 'atendente'), (request, response, next) => {
  try {
    const { customer, device, priority = 'normal', intakeNotes = '' } = request.body;

    if (!customer || !device) {
      throw new HttpError(400, 'Cliente e aparelho sao obrigatorios para abrir OS.');
    }

    findCustomer(customer);
    const selectedDevice = findDevice(device);

    if (selectedDevice.customer !== customer) {
      throw new HttpError(400, 'Cliente ou aparelho invalido para esta OS.');
    }

    const order = {
      _id: nextId('order', orders),
      code: `OS-${String(orders.length + 1).padStart(5, '0')}`,
      customer,
      device,
      status: 'entrada',
      priority,
      intakeNotes,
      createdBy: request.user._id,
      diagnosis: {},
      budget: {},
      execution: {},
      payment: { status: 'pendente', amountPaid: 0 },
      delivery: {},
      history: [
        {
          action: 'OS aberta',
          toStatus: 'entrada',
          note: intakeNotes || 'Equipamento recebido na assistencia.',
          user: request.user._id,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    response.status(201).json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.get('/orders/:id', (request, response, next) => {
  try {
    response.json(populateOrder(findOrder(request.params.id)));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/status', authorize('admin', 'atendente', 'tecnico', 'financeiro'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    addHistory(order, 'Status alterado', request.user, request.body.note || '', request.body.status);
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/diagnosis', authorize('admin', 'tecnico'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const { description } = request.body;

    if (!description) {
      throw new HttpError(400, 'Informe o diagnostico tecnico.');
    }

    order.diagnosis = {
      description,
      technician: request.user._id,
      completedAt: new Date().toISOString(),
    };
    addHistory(order, 'Diagnostico registrado', request.user, description, 'diagnostico');
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/budget', authorize('admin', 'tecnico'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const { description, partsValue = 0, laborValue = 0 } = request.body;
    const totalValue = Number(partsValue) + Number(laborValue);

    order.budget = {
      description,
      partsValue: Number(partsValue),
      laborValue: Number(laborValue),
      totalValue,
      approved: null,
    };
    addHistory(order, 'Orcamento registrado', request.user, description, 'aguardando_aprovacao');
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/budget/decision', authorize('admin', 'atendente'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const approved = Boolean(request.body.approved);

    order.budget = {
      ...order.budget,
      approved,
      decidedAt: new Date().toISOString(),
      rejectionReason: approved ? '' : request.body.rejectionReason || '',
    };
    addHistory(
      order,
      approved ? 'Orcamento aprovado' : 'Orcamento rejeitado',
      request.user,
      approved ? 'Cliente aprovou o orcamento.' : request.body.rejectionReason || '',
      approved ? 'aprovado' : 'rejeitado',
    );
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/execution', authorize('admin', 'tecnico'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const { notes = '', completed = false } = request.body;

    order.execution = {
      notes,
      technician: request.user._id,
      completedAt: completed ? new Date().toISOString() : undefined,
    };
    addHistory(
      order,
      completed ? 'Servico finalizado' : 'Servico em execucao',
      request.user,
      notes,
      completed ? 'aguardando_pagamento' : 'em_execucao',
    );
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/payment', authorize('admin', 'financeiro'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const paid = Number(request.body.amountPaid || 0);
    const total = Number(order.budget?.totalValue || 0);
    const paymentStatus = total > 0 && paid < total ? 'parcial' : 'pago';

    order.payment = {
      status: paymentStatus,
      method: request.body.method || 'dinheiro',
      amountPaid: paid,
      paidAt: new Date().toISOString(),
    };
    addHistory(order, 'Pagamento registrado', request.user, `Pagamento via ${order.payment.method}`, paymentStatus === 'pago' ? 'pago' : order.status);
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

demoRouter.patch('/orders/:id/delivery', authorize('admin', 'atendente'), (request, response, next) => {
  try {
    const order = findOrder(request.params.id);
    const { deliveredTo, notes = '' } = request.body;

    order.delivery = {
      deliveredAt: new Date().toISOString(),
      deliveredTo,
      notes,
    };
    addHistory(order, 'Aparelho entregue', request.user, notes || `Entregue para ${deliveredTo}`, 'entregue');
    response.json(populateOrder(order));
  } catch (error) {
    next(error);
  }
});

function authenticate(request, _response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Token de autenticacao nao informado.');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, secret());
    const user = users.find((item) => item._id === payload.sub);

    if (!user || !user.active) {
      throw new HttpError(401, 'Usuario nao autorizado.');
    }

    request.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, 'Token invalido ou expirado.'));
  }
}

function authorize(...roles) {
  return (request, _response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(new HttpError(403, 'Perfil sem permissao para esta acao.'));
    }

    return next();
  };
}

function addHistory(order, action, user, note, nextStatus) {
  const fromStatus = order.status;

  if (nextStatus) {
    order.status = nextStatus;
  }

  order.history.unshift({
    action,
    fromStatus,
    toStatus: nextStatus || order.status,
    note,
    user: user._id,
    createdAt: new Date().toISOString(),
  });
}

function populateOrder(order) {
  return {
    ...order,
    customer: findCustomer(order.customer),
    device: populateDevice(findDevice(order.device)),
    createdBy: publicUserById(order.createdBy),
    diagnosis: order.diagnosis?.technician
      ? {
          ...order.diagnosis,
          technician: publicUserById(order.diagnosis.technician),
        }
      : order.diagnosis,
    execution: order.execution?.technician
      ? {
          ...order.execution,
          technician: publicUserById(order.execution.technician),
        }
      : order.execution,
    history: order.history.map((item) => ({
      ...item,
      user: item.user ? publicUserById(item.user) : undefined,
    })),
  };
}

function populateDevice(device) {
  return {
    ...device,
    customer: findCustomer(device.customer),
  };
}

function findCustomer(id) {
  const customer = customers.find((item) => item._id === id);

  if (!customer) {
    throw notFound('Cliente nao encontrado.');
  }

  return customer;
}

function findDevice(id) {
  const device = devices.find((item) => item._id === id);

  if (!device) {
    throw notFound('Aparelho nao encontrado.');
  }

  return device;
}

function findOrder(id) {
  const order = orders.find((item) => item._id === id);

  if (!order) {
    throw notFound('Ordem de servico nao encontrada.');
  }

  return order;
}

function publicUserById(id) {
  const user = users.find((item) => item._id === id);
  return user ? publicUser(user) : undefined;
}

function publicUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function signToken(user) {
  return jwt.sign({ role: user.role, name: user.name }, secret(), {
    subject: user._id,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function secret() {
  return process.env.JWT_SECRET || 'assistech-demo-secret';
}

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function nextId(prefix, collection) {
  return `${prefix}-${Date.now().toString(36)}-${collection.length + 1}`;
}

function countBy(collection, key) {
  return Object.entries(
    collection.reduce((accumulator, item) => {
      accumulator[item[key]] = (accumulator[item[key]] || 0) + 1;
      return accumulator;
    }, {}),
  );
}

function byNewest(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function history(action, fromStatus, toStatus, note, user, days) {
  return {
    action,
    fromStatus,
    toStatus,
    note,
    user,
    createdAt: daysAgo(days),
  };
}
