import {
  BarChart3,
  ClipboardList,
  Cpu,
  LogOut,
  MonitorSmartphone,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { roleLabels } from '../data/labels';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'atendente', 'tecnico', 'financeiro'] },
  { to: '/clientes', label: 'Clientes', icon: Users, roles: ['admin', 'atendente', 'tecnico', 'financeiro'] },
  { to: '/aparelhos', label: 'Aparelhos', icon: MonitorSmartphone, roles: ['admin', 'atendente', 'tecnico', 'financeiro'] },
  { to: '/ordens', label: 'Ordens', icon: ClipboardList, roles: ['admin', 'atendente', 'tecnico', 'financeiro'] },
  { to: '/usuarios', label: 'Usuarios', icon: Cpu, roles: ['admin'] },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white">
            <Wrench size={23} />
          </div>
          <div>
            <p className="text-xl font-black text-ink">AssisTech</p>
            <p className="text-xs font-semibold text-muted">Gestao de assistencia</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-slate-50 p-4">
          <p className="font-black text-ink">{user?.name}</p>
          <p className="text-sm text-muted">{user ? roleLabels[user.role] : ''}</p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
            onClick={logout}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="text-primary-600" size={22} />
            <span className="font-black text-ink">AssisTech</span>
          </div>
          <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700" onClick={logout}>
            Sair
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${
                    isActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
      </header>

      <main className="px-4 py-6 lg:ml-72 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
