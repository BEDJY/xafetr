import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Box,
  Layers,
  ShoppingCart,
  Users,
  FolderTree,
  Image,
  Tag,
  Receipt,
  Truck,
  CreditCard,
  Shield,
  Users2,
  Warehouse,
  Percent,
  Map,
  Building,
  Activity,
  Settings,
  PlusCircle,
  Sparkles,
  Moon,
  Sun,
  X,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: () => void;
  onToggleTheme?: () => void;
  darkMode?: boolean;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  category: 'Navegación' | 'Acciones Rápidas';
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onToggleTheme,
  darkMode,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Acciones Rápidas
    {
      id: 'action-add-product',
      title: 'Crear Nuevo Producto',
      subtitle: 'Añadir artículo al catálogo con precio, SKU y multimedia',
      icon: PlusCircle,
      category: 'Acciones Rápidas',
      badge: 'Nuevo',
      action: () => {
        onClose();
        if (onAddProduct) onAddProduct();
        else navigate('/');
      },
    },
    {
      id: 'action-variant-matrix',
      title: 'Generador de Matriz de Variantes',
      subtitle: 'Crear combinaciones de tallas, colores y atributos en lote',
      icon: Sparkles,
      category: 'Acciones Rápidas',
      badge: 'Matrix',
      action: () => {
        onClose();
        navigate('/product-variants');
      },
    },
    {
      id: 'action-theme-toggle',
      title: darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro',
      subtitle: 'Alternar la apariencia visual del panel',
      icon: darkMode ? Sun : Moon,
      category: 'Acciones Rápidas',
      action: () => {
        if (onToggleTheme) onToggleTheme();
        onClose();
      },
    },

    // Navegación Catálogo
    {
      id: 'nav-products',
      title: 'Catálogo de Productos',
      subtitle: 'Listado completo de productos, filtros y edición',
      icon: Box,
      category: 'Navegación',
      action: () => {
        navigate('/');
        onClose();
      },
    },
    {
      id: 'nav-variants',
      title: 'Variantes de Producto & Inventario',
      subtitle: 'Precios, stock, ofertas flash y edición en lote',
      icon: Layers,
      category: 'Navegación',
      action: () => {
        navigate('/product-variants');
        onClose();
      },
    },
    {
      id: 'nav-orders',
      title: 'Pedidos & Facturación',
      subtitle: 'Flujo de preparación, envíos y cobros',
      icon: ShoppingCart,
      category: 'Navegación',
      action: () => {
        navigate('/orders');
        onClose();
      },
    },
    {
      id: 'nav-customers',
      title: 'Directorio de Clientes',
      subtitle: 'Historial de compras, direcciones y verificación',
      icon: Users,
      category: 'Navegación',
      action: () => {
        navigate('/customers');
        onClose();
      },
    },
    {
      id: 'nav-collections',
      title: 'Colecciones & Categorías',
      subtitle: 'Organización temática y ofertas flash automáticas',
      icon: FolderTree,
      category: 'Navegación',
      action: () => {
        navigate('/collections');
        onClose();
      },
    },
    {
      id: 'nav-assets',
      title: 'Multimedia & Assets (Cloudflare R2)',
      subtitle: 'Galería de fotos, optimización WebP y URLs',
      icon: Image,
      category: 'Navegación',
      action: () => {
        navigate('/assets');
        onClose();
      },
    },
    {
      id: 'nav-promotions',
      title: 'Promociones & Cupones',
      subtitle: 'Reglas de descuento y cupones de compra',
      icon: Tag,
      category: 'Navegación',
      action: () => {
        navigate('/promotions');
        onClose();
      },
    },
    {
      id: 'nav-alegra',
      title: 'Alegra ERP Facturación',
      subtitle: 'Comprobantes fiscales (NCF), sincronización y cotizaciones',
      icon: Receipt,
      category: 'Navegación',
      badge: 'ERP',
      action: () => {
        navigate('/alegra');
        onClose();
      },
    },
    {
      id: 'nav-stock-locations',
      title: 'Almacenes & Multi-Stock',
      subtitle: 'Depósitos centrales, sucursales y ubicaciones físicas',
      icon: Warehouse,
      category: 'Navegación',
      action: () => {
        navigate('/stock-locations');
        onClose();
      },
    },
    {
      id: 'nav-customer-groups',
      title: 'Grupos de Clientes (B2B & VIP)',
      subtitle: 'Segmentación mayorista, minorista y beneficios',
      icon: Users2,
      category: 'Navegación',
      action: () => {
        navigate('/customer-groups');
        onClose();
      },
    },
    {
      id: 'nav-taxes',
      title: 'Tasas de Impuestos & ITBIS',
      subtitle: 'Configuración fiscal para facturas y zonas',
      icon: Percent,
      category: 'Navegación',
      action: () => {
        navigate('/taxes');
        onClose();
      },
    },
    {
      id: 'nav-zones',
      title: 'Zonas Geográficas & Países',
      subtitle: 'Coberturas de envío y países habilitados',
      icon: Map,
      category: 'Navegación',
      action: () => {
        navigate('/zones');
        onClose();
      },
    },
    {
      id: 'nav-shipping',
      title: 'Métodos de Envío',
      subtitle: 'Tarifas, transportistas y zonas de reparto',
      icon: Truck,
      category: 'Navegación',
      action: () => {
        navigate('/shipping-methods');
        onClose();
      },
    },
    {
      id: 'nav-payment',
      title: 'Pasarelas de Pago',
      subtitle: 'Stripe, PayPal, Contra Entrega y Transferencia',
      icon: CreditCard,
      category: 'Navegación',
      action: () => {
        navigate('/payment-methods');
        onClose();
      },
    },
    {
      id: 'nav-roles',
      title: 'Roles & Permisos de Acceso',
      subtitle: 'Seguridad granular para empleados y administradores',
      icon: Shield,
      category: 'Navegación',
      action: () => {
        navigate('/roles');
        onClose();
      },
    },
    {
      id: 'nav-sellers',
      title: 'Vendedores Marketplace',
      subtitle: 'Cuentas de comerciantes y marcas externas',
      icon: Building,
      category: 'Navegación',
      action: () => {
        navigate('/sellers');
        onClose();
      },
    },
    {
      id: 'nav-system',
      title: 'Diagnóstico & Salud del Sistema',
      subtitle: 'Monitoreo de latencia GraphQL, base de datos y colas',
      icon: Activity,
      category: 'Navegación',
      badge: 'En vivo',
      action: () => {
        navigate('/system');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Configuración de la Tienda',
      subtitle: 'Ajustes generales, nombre, moneda y contacto',
      icon: Settings,
      category: 'Navegación',
      action: () => {
        navigate('/settings');
        onClose();
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-200/80 bg-white shadow-2xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar módulo, producto, acción o comando..."
            className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y-0"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-400">
              No se encontraron coincidencias para &quot;{search}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/10 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100'
                      : 'text-zinc-700 hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 text-[9px] font-bold text-sky-500">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ms-3">
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="h-3.5 w-3.5 text-sky-500" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-t border-zinc-200/80 text-[11px] text-zinc-400 dark:bg-zinc-950/50 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.2 text-[10px] font-mono dark:border-zinc-700 dark:bg-zinc-800">↑↓</kbd>
              Navegar
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.2 text-[10px] font-mono dark:border-zinc-700 dark:bg-zinc-800">↵</kbd>
              Seleccionar
            </span>
          </div>
          <span className="inline-flex items-center gap-1">
            <Command className="h-3 w-3" /> Paleta de Comandos DobEha
          </span>
        </div>
      </div>
    </div>
  );
};
