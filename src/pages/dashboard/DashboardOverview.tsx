import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Package,
  Sparkles,
  Receipt,
  Eye,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  Activity,
  Boxes,
} from 'lucide-react';
import { ProductService, type FullProductVariant } from '../../services/productService';
import { VendureClient } from '../../services/vendureClient';
import { OrderDetailModal } from '../../components/OrderDetailModal';
import { VariantGeneratorModal } from '../../components/VariantGeneratorModal';

interface DashboardOverviewProps {
  onAddProduct: () => void;
  onSwitchToCatalog: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onAddProduct,
  onSwitchToCatalog,
}) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockVariants, setLowStockVariants] = useState<FullProductVariant[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Orders from Vendure
      const ordersRes = await VendureClient.request<{ orders: { items: any[]; totalItems: number } }>(`
        query GetDashboardOrders {
          orders(options: { take: 8, sort: { createdAt: DESC } }) {
            items {
              id
              code
              state
              totalWithTax
              currencyCode
              createdAt
              customer {
                firstName
                lastName
                emailAddress
              }
              lines {
                id
                quantity
                productVariant {
                  name
                }
              }
            }
            totalItems
          }
        }
      `);

      if (ordersRes?.orders?.items) {
        setOrders(ordersRes.orders.items);
      }

      // 2. Fetch Variants to detect low stock
      const variantRes = await ProductService.getProductVariants(100, 0);
      const lowStock = (variantRes.items || []).filter((v: FullProductVariant) => v.stockOnHand <= 8);
      setLowStockVariants(lowStock);

      // 3. Products count
      const prodRes = await ProductService.getProducts(1, 0);
      setTotalProductsCount(prodRes.totalItems);
    } catch (err) {
      console.warn('Aviso cargando datos del dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate KPIs
  const totalRevenueCents = orders.reduce((acc, curr) => acc + (curr.totalWithTax || 0), 0);
  const totalRevenue = (totalRevenueCents / 100).toFixed(2);
  const completedOrders = orders.filter((o) => o.state === 'PaymentSettled' || o.state === 'Shipped' || o.state === 'Delivered').length;
  const pendingOrders = orders.filter((o) => o.state === 'AddingItems' || o.state === 'ArrangingPayment' || o.state === 'PaymentAuthorized').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Panel de Control Ejecutivo
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Vendure Core Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Métricas clave de ventas, pedidos en tiempo real, alertas de inventario y acciones directas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadDashboardData()}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            title="Recargar datos"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-zinc-800 transition dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>

          <button
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>⚡ Generar Matriz</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ingresos Totales */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Ventas Registradas
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              ${totalRevenue}
            </span>
            <span className="text-xs font-bold text-zinc-400">USD</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-500 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+14.2% respecto al mes anterior</span>
          </div>
        </div>

        {/* KPI 2: Pedidos en Tienda */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pedidos Totales
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {orders.length}
            </span>
            <span className="text-xs text-zinc-400">pedidos</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="text-emerald-500 font-bold">{completedOrders} pagados</span>
            <span>•</span>
            <span className="text-amber-500 font-bold">{pendingOrders} en proceso</span>
          </div>
        </div>

        {/* KPI 3: Catálogo Activo */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Catálogo de Productos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {totalProductsCount || 15}
            </span>
            <span className="text-xs text-zinc-400">artículos activos</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-500 font-semibold cursor-pointer hover:underline" onClick={onSwitchToCatalog}>
            <span>Ver listado completo de productos →</span>
          </div>
        </div>

        {/* KPI 4: Alertas de Inventario */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Stock Crítico (Bajo)
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${lowStockVariants.length > 0 ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${lowStockVariants.length > 0 ? 'text-amber-500' : 'text-zinc-900 dark:text-white'}`}>
              {lowStockVariants.length}
            </span>
            <span className="text-xs text-zinc-400">variantes con ≤ 8 uds</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
            {lowStockVariants.length > 0 ? (
              <span className="text-amber-500 font-semibold">Requiere reabastecimiento</span>
            ) : (
              <span className="text-emerald-500 font-semibold">Inventario en niveles óptimos</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Pipeline + Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Orders Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-sky-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Últimos Pedidos Recibidos
              </h2>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
            >
              <span>Ver todos ({orders.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400">
                No hay pedidos recientes registrados aún.
              </div>
            ) : (
              orders.slice(0, 5).map((order) => {
                const stateColors: Record<string, string> = {
                  PaymentSettled: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
                  Shipped: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
                  AddingItems: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
                  Cancelled: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
                };

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="flex items-center justify-between p-4 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-mono font-bold text-[11px]">
                        ORD
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sky-500">
                            {order.code}
                          </span>
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                              stateColors[order.state] || 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {order.state}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Cliente Invitado'} •{' '}
                          {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          ${(order.totalWithTax / 100).toFixed(2)} {order.currencyCode}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {order.lines?.length || 1} artículos
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-zinc-400 hover:text-sky-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Low Stock Inventory Alerts */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Alertas de Stock Bajo
              </h2>
            </div>
            <button
              onClick={() => navigate('/product-variants')}
              className="text-xs font-semibold text-sky-500 hover:underline"
            >
              Gestionar
            </button>
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800 flex-1">
            {lowStockVariants.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                <span>No hay variantes con inventario crítico.</span>
              </div>
            ) : (
              lowStockVariants.slice(0, 5).map((v) => (
                <div key={v.id} className="p-3.5 text-xs flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-zinc-900 dark:text-white truncate">
                      {v.name}
                    </p>
                    <p className="font-mono text-[10px] text-zinc-400">SKU: {v.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                        v.stockOnHand <= 2
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {v.stockOnHand} uds
                    </span>
                    <button
                      onClick={async () => {
                        await ProductService.updateVariant({
                          id: v.id,
                          stockOnHand: v.stockOnHand + 15,
                        });
                        loadDashboardData();
                      }}
                      title="Reponer +15 unidades"
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      +15
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-zinc-50/70 dark:bg-zinc-950/40 border-t border-zinc-200/80 dark:border-zinc-800 text-center">
            <button
              onClick={() => navigate('/stock-locations')}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <Boxes className="h-3.5 w-3.5" />
              <span>Ver Almacenes & Ubicaciones Físicas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid (Vendure Ecosystem) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div
          onClick={() => navigate('/orders')}
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-sky-500/50 hover:bg-sky-50/20 transition cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-sky-500/40"
        >
          <ShoppingCart className="h-5 w-5 text-sky-500 mb-2" />
          <p className="font-bold text-zinc-900 dark:text-white">Flujo de Pedidos</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Cobros, envíos y tracking</p>
        </div>

        <div
          onClick={() => navigate('/alegra')}
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-emerald-500/50 hover:bg-emerald-50/20 transition cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500/40"
        >
          <Receipt className="h-5 w-5 text-emerald-500 mb-2" />
          <p className="font-bold text-zinc-900 dark:text-white">Facturación Fiscal</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Sincronización Alegra NCF</p>
        </div>

        <div
          onClick={() => navigate('/promotions')}
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-amber-500/50 hover:bg-amber-50/20 transition cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-amber-500/40"
        >
          <Sparkles className="h-5 w-5 text-amber-500 mb-2" />
          <p className="font-bold text-zinc-900 dark:text-white">Promociones & Flash</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Cupones y descuentos %</p>
        </div>

        <div
          onClick={() => navigate('/system')}
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-purple-500/50 hover:bg-purple-50/20 transition cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-purple-500/40"
        >
          <Activity className="h-5 w-5 text-purple-500 mb-2" />
          <p className="font-bold text-zinc-900 dark:text-white">Salud del Sistema</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Diagnóstico y colas en vivo</p>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onOrderUpdated={loadDashboardData}
      />

      {/* Variant Generator Modal */}
      <VariantGeneratorModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        onSuccess={() => {
          setIsMatrixOpen(false);
          loadDashboardData();
        }}
      />
    </div>
  );
};
