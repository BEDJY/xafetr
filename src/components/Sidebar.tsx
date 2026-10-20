import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Box,
  FolderTree,
  Image,
  ShoppingCart,
  Users,
  Zap,
  Tag,
  Store,
  Shield,
  Truck,
  CreditCard,
  Layers,
  ChevronLeft,
  ChevronRight,
  Settings,
  Palette,
  PlusCircle,
  Receipt,
  Sparkles,
  Globe,
  Warehouse,
  Users2,
  Key,
  Percent,
  Map,
  Building,
  Activity,
} from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useChannel } from '../context/ChannelContext';
import { useAI } from '../context/AIContext';
import { ChannelSelectionModal } from './ChannelSelectionModal';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface NavSection {
  title: string;
  items: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { themePreset } = useThemeContext();
  const { activeChannel } = useChannel();
  const { setIsOpen: setIsAIOpen } = useAI();
  const [channelModalOpen, setChannelModalOpen] = useState(false);

  const sections: NavSection[] = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard & Métricas', path: '/', icon: BarChart3 },
        { name: 'Salud del Sistema', path: '/system', icon: Activity, badge: 'En vivo' },
      ],
    },
    {
      title: 'Catálogo & Inventario',
      items: [
        { name: 'Productos', path: '/products', icon: Box },
        { name: 'Variantes de Producto', path: '/product-variants', icon: Layers },
        { name: 'Almacenes & Stock', path: '/stock-locations', icon: Warehouse, badge: 'Multi' },
        { name: 'Facetas & Filtros', path: '/facets', icon: Tag },
        { name: 'Colecciones', path: '/collections', icon: FolderTree },
        { name: 'Multimedia (R2)', path: '/assets', icon: Image },
      ],
    },
    {
      title: 'Ventas & Facturación',
      items: [
        { name: 'Pedidos (Orders)', path: '/orders', icon: ShoppingCart },
        { name: 'Alegra ERP (Facturas & NCF)', path: '/alegra', icon: Receipt, badge: '⚡ Alegra' },
        { name: 'Clientes (Customers)', path: '/customers', icon: Users },
        { name: 'Grupos de Clientes', path: '/customer-groups', icon: Users2, badge: 'VIP/B2B' },
        { name: 'Vendedores Marketplace', path: '/sellers', icon: Building },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { name: 'Ofertas Flash', path: '/flash-sales', icon: Zap, badge: '⚡ Flash' },
        { name: 'Promociones & Cupones', path: '/promotions', icon: Tag },
      ],
    },
    {
      title: 'Diseño & Tienda',
      items: [
        { name: 'Editor Visual (Puck AI)', path: '/store-settings?tab=builder', icon: Sparkles, badge: 'IA' },
        { name: 'Vista Previa Tienda', path: '/store-settings?tab=preview', icon: Globe, badge: 'En vivo' },
        { name: 'Identidad de Marca', path: '/store-settings?tab=branding', icon: Palette, badge: '🎨 Marca' },
      ],
    },
    {
      title: 'Configuración Global',
      items: [
        { name: 'Tiendas & Canales', path: '/channels', icon: Store },
        { name: 'Crear Nueva Tienda', path: '/create-store', icon: PlusCircle, badge: '✨ Nuevo' },
        { name: 'Administradores', path: '/administrators', icon: Shield },
        { name: 'Roles & Permisos', path: '/roles', icon: Key, badge: 'Seguridad' },
        { name: 'Métodos de Envío', path: '/shipping-methods', icon: Truck },
        { name: 'Pasarelas de Pago', path: '/payment-methods', icon: CreditCard },
        { name: 'Impuestos (ITBIS / IVA)', path: '/taxes', icon: Percent },
        { name: 'Países & Zonas', path: '/zones', icon: Map },
        { name: 'Colas de Trabajo', path: '/job-queue', icon: Layers },
        { name: 'Ajustes Generales', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/95 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Botón de Colapso */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Indicador de Tienda Activa en Sidebar */}
      {!isCollapsed && activeChannel && (
        <button
          type="button"
          onClick={() => setChannelModalOpen(true)}
          className="mx-3 mt-3 mb-1 text-left rounded-xl border border-sky-500/20 bg-sky-500/5 p-2.5 hover:bg-sky-500/10 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 transition cursor-pointer group w-[calc(100%-1.5rem)]"
          title="Cambiar Tienda / Administrar Canales"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: activeChannel.customFields?.brandColor || '#0ea5e9' }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-sky-500 uppercase tracking-wider flex items-center justify-between">
                <span>Tienda Activa</span>
                <span className="text-[9px] text-zinc-400 group-hover:text-sky-500 font-normal underline">Cambiar</span>
              </p>
              <p className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                {activeChannel.customFields?.displayName || activeChannel.code}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Lista de Secciones y Opciones */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const itemPathOnly = item.path.split('?')[0];
                const itemQueryOnly = item.path.includes('?') ? item.path.split('?')[1] : null;

                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : itemQueryOnly
                      ? location.pathname === itemPathOnly && location.search.includes(itemQueryOnly)
                      : location.pathname === itemPathOnly && !location.search;

                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? `${themePreset.bg} font-semibold text-white shadow-sm`
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100'}`} />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-500">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón Asistente IA en Sidebar */}
      <div className="p-2 border-t border-zinc-200/80 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setIsAIOpen(true)}
          className={`w-full flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/70 p-2 text-xs font-bold text-indigo-600 dark:border-indigo-800/60 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-purple-500/20 transition cursor-pointer shadow-2xs ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
          title="Abrir Chat IA (Gemini Asistente)"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-tr from-indigo-600 to-purple-600 text-white shrink-0 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="text-left flex-1 truncate">
              <div className="flex items-center gap-1.5">
                <span className="leading-tight">Chat IA</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Asistente en vivo</p>
            </div>
          )}
        </button>
      </div>

      {/* Modal de Selección de Tienda / Canales */}
      <ChannelSelectionModal
        isOpen={channelModalOpen}
        onClose={() => setChannelModalOpen(false)}
      />
    </aside>
  );
};
