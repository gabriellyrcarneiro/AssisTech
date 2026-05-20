import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import { Customer } from './models/Customer.js';
import { Device } from './models/Device.js';
import { ServiceOrder } from './models/ServiceOrder.js';
import { User } from './models/User.js';

const users = [
  { name: 'Gabrielly Admin', email: 'admin@assistech.com', password: '123456', role: 'admin' },
  { name: 'Ana Atendente', email: 'atendente@assistech.com', password: '123456', role: 'atendente' },
  { name: 'Carlos Tecnico', email: 'tecnico@assistech.com', password: '123456', role: 'tecnico' },
  { name: 'Marina Financeiro', email: 'financeiro@assistech.com', password: '123456', role: 'financeiro' },
];

async function upsertUsers() {
  const created = [];

  for (const userData of users) {
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const userWithPassword = await User.findById(user._id).select('+password');
    if (!userWithPassword.password) {
      userWithPassword.password = userData.password;
      await userWithPassword.save();
    }

    created.push(user);
  }

  return created;
}

async function seed() {
  await connectDatabase();

  const [admin, attendant, technician, financial] = await upsertUsers();
  await Customer.deleteMany({});
  await Device.deleteMany({});
  await ServiceOrder.deleteMany({});

  const customers = await Customer.create([
    {
      name: 'Juliana Martins',
      phone: '(85) 99999-0101',
      email: 'juliana@email.com',
      document: '123.456.789-00',
      address: 'Rua das Flores, 120',
      notes: 'Cliente prefere contato por WhatsApp.',
    },
    {
      name: 'Pedro Henrique',
      phone: '(85) 98888-0202',
      email: 'pedro@email.com',
      document: '987.654.321-00',
      address: 'Av. Central, 555',
    },
    {
      name: 'Bianca Lima',
      phone: '(85) 97777-0303',
      email: 'bianca@email.com',
      document: '456.789.123-00',
      address: 'Condominio Norte, bloco B',
    },
  ]);

  const devices = await Device.create([
    {
      customer: customers[0]._id,
      type: 'celular',
      brand: 'Apple',
      model: 'iPhone 12',
      imei: '359999999999991',
      condition: 'Tela trincada e carcaça com marcas de queda.',
      accessories: 'Sem carregador.',
      problemDescription: 'Tela nao liga depois de queda.',
      createdBy: attendant._id,
    },
    {
      customer: customers[1]._id,
      type: 'notebook',
      brand: 'Dell',
      model: 'Inspiron 15',
      serialNumber: 'DL-2026-7788',
      condition: 'Bom estado externo.',
      accessories: 'Carregador original.',
      problemDescription: 'Notebook esquenta e desliga sozinho.',
      createdBy: attendant._id,
    },
    {
      customer: customers[2]._id,
      type: 'celular',
      brand: 'Samsung',
      model: 'Galaxy A52',
      imei: '358888888888882',
      condition: 'Oxidacao leve na bandeja do chip.',
      accessories: 'Capa transparente.',
      problemDescription: 'Aparelho nao carrega.',
      createdBy: attendant._id,
    },
  ]);

  await ServiceOrder.create([
    {
      code: 'OS-00001',
      customer: customers[0]._id,
      device: devices[0]._id,
      status: 'aguardando_aprovacao',
      priority: 'alta',
      intakeNotes: 'Cliente precisa do aparelho para trabalho.',
      createdBy: attendant._id,
      diagnosis: {
        description: 'Display danificado. Placa sem sinais de curto.',
        technician: technician._id,
        completedAt: new Date(),
      },
      budget: {
        description: 'Troca do modulo frontal.',
        partsValue: 520,
        laborValue: 120,
        totalValue: 640,
        approved: null,
      },
      history: [
        { action: 'OS aberta', toStatus: 'entrada', user: attendant._id, note: 'Equipamento recebido.' },
        { action: 'Diagnostico registrado', fromStatus: 'entrada', toStatus: 'diagnostico', user: technician._id },
        {
          action: 'Orcamento registrado',
          fromStatus: 'diagnostico',
          toStatus: 'aguardando_aprovacao',
          user: technician._id,
        },
      ],
    },
    {
      code: 'OS-00002',
      customer: customers[1]._id,
      device: devices[1]._id,
      status: 'em_execucao',
      priority: 'normal',
      intakeNotes: 'Verificar aquecimento.',
      createdBy: attendant._id,
      budget: {
        description: 'Limpeza interna e troca de pasta termica.',
        partsValue: 35,
        laborValue: 110,
        totalValue: 145,
        approved: true,
        decidedAt: new Date(),
      },
      execution: {
        notes: 'Limpeza em andamento.',
        technician: technician._id,
      },
      history: [{ action: 'Servico em execucao', toStatus: 'em_execucao', user: technician._id }],
    },
    {
      code: 'OS-00003',
      customer: customers[2]._id,
      device: devices[2]._id,
      status: 'pago',
      priority: 'urgente',
      intakeNotes: 'Cliente autorizou avaliacao.',
      createdBy: admin._id,
      budget: {
        description: 'Troca do conector de carga.',
        partsValue: 45,
        laborValue: 100,
        totalValue: 145,
        approved: true,
        decidedAt: new Date(),
      },
      payment: {
        status: 'pago',
        method: 'pix',
        amountPaid: 145,
        paidAt: new Date(),
      },
      history: [
        { action: 'OS aberta', toStatus: 'entrada', user: admin._id },
        { action: 'Pagamento registrado', fromStatus: 'aguardando_pagamento', toStatus: 'pago', user: financial._id },
      ],
    },
  ]);

  console.log('Seed concluido.');
  console.log('Login demo: admin@assistech.com / 123456');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});

