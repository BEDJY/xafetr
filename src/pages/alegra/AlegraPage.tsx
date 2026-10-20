import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck2,
  Boxes,
  Settings,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Building2,
  DollarSign,
  Receipt,
  Check,
  Loader2,
  Unlink,
} from 'lucide-react';
import { VendureClient } from '../../services/vendureClient';
import { useChannel } from '../../context/ChannelContext';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate?: string;
  status: string;
  total: number;
  totalPaid?: number;
  balance?: number;
  client?: {
    id?: string;
    name: string;
    identification?: string;
    phone?: string;
    email?: string;
  };
  items?: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  pdfUrl?: string;
}

interface Estimate {
  id: string;
  number: string;
  date: string;
  dueDate?: string;
  status: string;
  total: number;
  client?: {
    id?: string;
    name: string;
    identification?: string;
    phone?: string;
    email?: string;
  };
  items?: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  notes?: string;
}

interface Item {
  id: string;
  name: string;
  reference?: string;
  description?: string;
  price: number;
  inventory?: {
    unit?: string;
    availableQuantity?: number;
    unitCost?: number;
  };
}

interface ConnectionStatus {
  connected: boolean;
  email?: string;
  hasToken: boolean;
  autoInvoice: boolean;
  autoSyncInventory?: boolean;
  company?: {
    name?: string;
    identification?: string;
    phone?: string;
    email?: string;
    regime?: string;
    currencyCode?: string;
  };
  message?: string;
}

export default function AlegraPage() {
  const { activeChannel } = useChannel();
  const [activeTab, setActiveTab] = useState<'invoices' | 'estimates' | 'inventory' | 'settings'>('invoices');

  // Datos reales
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExportingCatalog, setIsExportingCatalog] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Formulario configuración
  const [alegraEmail, setAlegraEmail] = useState('');
  const [alegraToken, setAlegraToken] = useState('');
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [autoSyncInventory, setAutoSyncInventory] = useState(true);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modales
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  // Nuevo item form modal
  const [newClientName, setNewClientName] = useState('');
  const [newClientRnc, setNewClientRnc] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('1500');
  const [newItemQty, setNewItemQty] = useState('1');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Cargar datos al montar y al cambiar de canal
  useEffect(() => {
    loadAllData();
  }, [activeChannel]);

  const loadAllData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Estado de Conexión Real
      const statusRes = await VendureClient.request<{ alegraStatus: ConnectionStatus }>(`
        query GetAlegraStatus {
          alegraStatus {
            connected
            email
            hasToken
            autoInvoice
            autoSyncInventory
            company {
              name
              identification
              phone
              email
              regime
              currencyCode
            }
            message
          }
        }
      `);
      const currentStatus = statusRes?.alegraStatus;
      if (currentStatus) {
        setStatus(currentStatus);
        setAlegraEmail(currentStatus.email || '');
        setAutoInvoice(currentStatus.autoInvoice);
        setAutoSyncInventory(currentStatus.autoSyncInventory !== false);
      }

      // Si no está conectado, no intentamos consultar facturas/inventario para no provocar errores innecesarios
      if (!currentStatus?.connected) {
        setInvoices([]);
        setEstimates([]);
        setItems([]);
        setIsLoading(false);
        return;
      }

      // 2. Facturas Reales de Alegra
      try {
        const invRes = await VendureClient.request<{ alegraInvoices: Invoice[] }>(`
          query GetAlegraInvoices {
            alegraInvoices(limit: 30) {
              id
              number
              date
              dueDate
              status
              total
              totalPaid
              balance
              client {
                name
                identification
                email
              }
              items {
                name
                price
                quantity
                total
              }
              pdfUrl
            }
          }
        `);
        setInvoices(invRes?.alegraInvoices || []);
      } catch (invErr: any) {
        setApiError(invErr.message || 'Error al consultar facturas en Alegra.');
      }

      // 3. Cotizaciones Reales de Alegra
      try {
        const estRes = await VendureClient.request<{ alegraEstimates: Estimate[] }>(`
          query GetAlegraEstimates {
            alegraEstimates(limit: 30) {
              id
              number
              date
              dueDate
              status
              total
              client {
                name
                identification
                email
              }
              items {
                name
                price
                quantity
                total
              }
              notes
            }
          }
        `);
        setEstimates(estRes?.alegraEstimates || []);
      } catch (estErr: any) {
        setApiError(estErr.message || 'Error al consultar cotizaciones en Alegra.');
      }

      // 4. Inventario Real de Alegra
      try {
        const itRes = await VendureClient.request<{ alegraItems: Item[] }>(`
          query GetAlegraItems {
            alegraItems(limit: 30) {
              id
              name
              reference
              price
              inventory {
                unit
                availableQuantity
                unitCost
              }
            }
          }
        `);
        setItems(itRes?.alegraItems || []);
      } catch (itErr: any) {
        setApiError(itErr.message || 'Error al consultar inventario en Alegra.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Error al consultar estado de Alegra.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSuccess(null);
    setConfigError(null);
    setIsLoading(true);

    try {
      const res = await VendureClient.request<{ configureAlegra: ConnectionStatus }>(
        `
        mutation ConfigureAlegra($input: ConfigureAlegraInput!) {
          configureAlegra(input: $input) {
            connected
            email
            hasToken
            autoInvoice
            autoSyncInventory
            company {
              name
              identification
              currencyCode
            }
            message
          }
        }
      `,
        {
          input: {
            email: alegraEmail.trim(),
            token: alegraToken.trim(),
            autoInvoice,
            autoSyncInventory,
          },
        }
      );

      if (res?.configureAlegra?.connected) {
        setStatus(res.configureAlegra);
        setConfigSuccess(res.configureAlegra.message || '¡Conexión verificada exitosamente con Alegra!');
        await loadAllData();
      } else {
        throw new Error(res?.configureAlegra?.message || 'No se pudo conectar con Alegra');
      }
    } catch (err: any) {
      setConfigError(err.message || 'Error al conectar con la API de Alegra.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushProducts = async () => {
    if (!status?.connected) {
      setActiveTab('settings');
      return;
    }

    setIsExportingCatalog(true);
    setSyncFeedback(null);
    setApiError(null);
    try {
      const res = await VendureClient.request<{ pushProductsToAlegra: any }>(`
        mutation PushProductsToAlegra {
          pushProductsToAlegra {
            success
            syncedItemsCount
            updatedVariantsCount
            message
            details
          }
        }
      `);
      setSyncFeedback(res?.pushProductsToAlegra?.message || 'Catálogo exportado exitosamente a Alegra.');
      await loadAllData();
    } catch (err: any) {
      setApiError('Error al exportar productos a Alegra: ' + err.message);
    } finally {
      setIsExportingCatalog(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('¿Estás seguro de que deseas desconectar esta tienda de Alegra?')) return;
    setIsLoading(true);
    try {
      await VendureClient.request(`
        mutation DisconnectAlegra {
          disconnectAlegra
        }
      `);
      setAlegraToken('');
      setStatus({ connected: false, hasToken: false, autoInvoice: false, autoSyncInventory: false });
      setInvoices([]);
      setEstimates([]);
      setItems([]);
      setConfigSuccess('Cuenta de Alegra desconectada.');
    } catch (err: any) {
      alert('Error al desconectar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncInventory = async () => {
    if (!status?.connected) {
      setActiveTab('settings');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    setApiError(null);
    try {
      const res = await VendureClient.request<{ syncAlegraInventory: any }>(`
        mutation SyncAlegraInventory {
          syncAlegraInventory {
            success
            syncedItemsCount
            updatedVariantsCount
            message
            details
          }
        }
      `);
      setSyncFeedback(res?.syncAlegraInventory?.message || 'Inventario sincronizado con éxito');
      await loadAllData();
    } catch (err: any) {
      setApiError('Error de Alegra en sincronización: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDoc(true);
    setApiError(null);
    try {
      const input = {
        clientName: newClientName.trim() || 'Cliente Mostrador',
        clientIdentification: newClientRnc.trim() || undefined,
        clientEmail: newClientEmail.trim() || undefined,
        items: [
          {
            name: newItemName.trim() || 'Producto General',
            price: parseFloat(newItemPrice) || 1000,
            quantity: parseFloat(newItemQty) || 1,
          },
        ],
      };

      await VendureClient.request(
        `
        mutation CreateInvoice($input: CreateAlegraInvoiceInput!) {
          createAlegraInvoice(input: $input) {
            id
            number
            total
          }
        }
      `,
        { input }
      );

      setShowInvoiceModal(false);
      resetDocForm();
      await loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error al emitir factura en Alegra');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleCreateEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDoc(true);
    setApiError(null);
    try {
      const input = {
        clientName: newClientName.trim() || 'Cliente Cotización',
        clientIdentification: newClientRnc.trim() || undefined,
        clientEmail: newClientEmail.trim() || undefined,
        items: [
          {
            name: newItemName.trim() || 'Servicio / Lote Cotizado',
            price: parseFloat(newItemPrice) || 2500,
            quantity: parseFloat(newItemQty) || 1,
          },
        ],
        notes: 'Cotización emitida desde Dokkany Store. Válida por 15 días.',
      };

      await VendureClient.request(
        `
        mutation CreateEstimate($input: CreateAlegraEstimateInput!) {
          createAlegraEstimate(input: $input) {
            id
            number
            total
          }
        }
      `,
        { input }
      );

      setShowEstimateModal(false);
      resetDocForm();
      await loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error al crear cotización en Alegra');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const resetDocForm = () => {
    setNewClientName('');
    setNewClientRnc('');
    setNewClientEmail('');
    setNewItemName('');
    setNewItemPrice('1500');
    setNewItemQty('1');
  };

  // KPIs
  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.totalPaid || 0), 0);
  const totalBalance = invoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);
  const totalEstimated = estimates.reduce((acc, est) => acc + (est.total || 0), 0);

  // Filtros
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client?.identification || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredEstimates = estimates.filter((est) => {
    const matchSearch =
      est.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (est.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredItems = items.filter((it) => {
    return (
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 font-sans">
      {/* ================= HEADER & STATUS ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  Alegra ERP & Facturación
                </h1>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  API Real Oficial
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gestión directa de Facturas, Cotizaciones e Inventario con la API REST de Alegra.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncInventory}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : 'text-zinc-500'}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Stock'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!status?.connected) {
                setActiveTab('settings');
                return;
              }
              setShowInvoiceModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nueva Factura</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!status?.connected) {
                setActiveTab('settings');
                return;
              }
              setShowEstimateModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nueva Cotización</span>
          </button>
        </div>
      </div>

      {/* Real API Error Banner */}
      {apiError && (
        <div className="flex items-start justify-between rounded-2xl border border-rose-500/30 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 dark:border-rose-500/20 dark:bg-rose-950/30 dark:text-rose-300">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold">Error devuelto por la API de Alegra:</p>
              <p className="mt-0.5 whitespace-pre-wrap">{apiError}</p>
            </div>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-xs font-bold underline hover:text-rose-900 cursor-pointer ml-3"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Sync Feedback Message */}
      {syncFeedback && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{syncFeedback}</span>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-xs font-bold underline hover:text-emerald-900 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Connection Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              status?.connected
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-white text-sm">
                {status?.connected && status.company?.name ? status.company.name : 'Alegra (Sin Conectar)'}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  status?.connected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                />
                {status?.connected ? 'API Conectada & Verificada' : 'Credenciales Pendientes'}
              </span>

              {status?.connected && status?.autoSyncInventory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Sync Automática Activa
                </span>
              )}
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              {status?.connected && status.company?.identification && (
                <>
                  RNC/Identificación Fiscal: <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{status.company.identification}</span> • Moneda:{' '}
                  <span className="font-bold">{status.company.currencyCode || 'USD'}</span> •{' '}
                </>
              )}
              Tienda Activa:{' '}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {activeChannel?.customFields?.displayName || activeChannel?.code}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status?.connected && (
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
              title="Desconectar credenciales de Alegra"
            >
              <Unlink className="h-3.5 w-3.5" />
              <span>Desconectar</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{status?.connected ? 'Gestionar Token' : 'Configurar Token de Alegra'}</span>
          </button>
        </div>
      </div>

      {/* Notice if not connected */}
      {!status?.connected && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Para ver tus facturas, cotizaciones e inventario reales desde tu cuenta de Alegra, ingresa tu <strong>Email</strong> y <strong>API Token</strong> en la pestaña de Conexión.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition shrink-0 cursor-pointer"
          >
            Conectar Ahora
          </button>
        </div>
      )}

      {/* ================= KPIS / RESUMEN ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Facturado</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-zinc-900 dark:text-white">
            ${totalInvoiced.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">{invoices.length} facturas registradas en Alegra</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Cobrado</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalPaid.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">Total cobrado y conciliado</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Por Cobrar / Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            ${totalBalance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">Cuentas por cobrar pendientes</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Cotizado (En Espera)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            ${totalEstimated.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">{estimates.length} cotizaciones activas</p>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition cursor-pointer ${
            activeTab === 'invoices'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Facturas de Venta ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('estimates')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition cursor-pointer ${
            activeTab === 'estimates'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Cotizaciones ({estimates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Inventario Alegra ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition cursor-pointer ${
            activeTab === 'settings'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Conexión & Token</span>
        </button>
      </div>

      {/* ================= TAB CONTENT 1: FACTURAS ================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por número fiscal, NCF, cliente o RNC..."
                className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="all">Todos los estados</option>
              <option value="paid">Cobradas (Pagadas)</option>
              <option value="open">Abiertas (Por cobrar)</option>
              <option value="void">Anuladas</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">Número / NCF</th>
                    <th className="px-4 py-3.5 font-bold">Cliente / RNC</th>
                    <th className="px-4 py-3.5 font-bold">Fecha / Vencimiento</th>
                    <th className="px-4 py-3.5 font-bold text-right">Total</th>
                    <th className="px-4 py-3.5 font-bold text-right">Saldo</th>
                    <th className="px-4 py-3.5 font-bold text-center">Estado</th>
                    <th className="px-4 py-3.5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-400">
                        {status?.connected
                          ? 'No hay facturas registradas en tu cuenta de Alegra.'
                          : 'No has conectado tu cuenta de Alegra todavía. Conecta tu API Token para ver tus facturas reales.'}
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/40 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                          {inv.number}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{inv.client?.name}</p>
                          {inv.client?.identification && (
                            <p className="text-[11px] text-zinc-400 font-mono">RNC: {inv.client.identification}</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                          <p>{inv.date}</p>
                          {inv.dueDate && <p className="text-[10px] text-zinc-400">Vence: {inv.dueDate}</p>}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-zinc-900 dark:text-white">
                          ${inv.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-right font-medium text-amber-600 dark:text-amber-400">
                          ${(inv.balance || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : inv.status === 'open'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-zinc-500/10 text-zinc-600'
                            }`}
                          >
                            {inv.status === 'paid' ? 'Cobrada' : inv.status === 'open' ? 'Por Cobrar' : inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {inv.pdfUrl && (
                              <a
                                href={inv.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                title="Descargar PDF Oficial de Alegra"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB CONTENT 2: COTIZACIONES ================= */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cotización por número o cliente..."
                className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">Número Cotización</th>
                    <th className="px-4 py-3.5 font-bold">Cliente</th>
                    <th className="px-4 py-3.5 font-bold">Emisión / Vencimiento</th>
                    <th className="px-4 py-3.5 font-bold">Notas / Observaciones</th>
                    <th className="px-4 py-3.5 font-bold text-right">Monto Cotizado</th>
                    <th className="px-4 py-3.5 font-bold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredEstimates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-400">
                        {status?.connected
                          ? 'No hay cotizaciones registradas en tu cuenta de Alegra.'
                          : 'Conecta tu cuenta de Alegra en "Conexión & Token" para gestionar cotizaciones.'}
                      </td>
                    </tr>
                  ) : (
                    filteredEstimates.map((est) => (
                      <tr key={est.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/40 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                          {est.number}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{est.client?.name}</p>
                          {est.client?.identification && (
                            <p className="text-[11px] text-zinc-400 font-mono">ID: {est.client.identification}</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                          <p>{est.date}</p>
                          {est.dueDate && <p className="text-[10px] text-zinc-400">Vence: {est.dueDate}</p>}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                          {est.notes || 'Sin observaciones'}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          ${est.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              est.status === 'accepted'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : est.status === 'open'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : 'bg-zinc-500/10 text-zinc-600'
                            }`}
                          >
                            {est.status === 'accepted' ? 'Aceptada' : est.status === 'open' ? 'Enviada / Pendiente' : est.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB CONTENT 3: INVENTARIO ================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Automatic sync status banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Boxes className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    Sincronización Automática en Tiempo Real:
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    ACTIVA
                  </span>
                </div>
                <p className="mt-1 text-emerald-800/80 dark:text-emerald-300/80">
                  Cada vez que creas o modificas un producto o variante en Vendure, se actualiza automáticamente en Alegra. Cuando un cliente realiza una compra, el stock se descuenta en Alegra y las existencias se mantienen sincronizadas de manera continua.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículo en catálogo real de Alegra..."
                className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePushProducts}
                disabled={isExportingCatalog || isSyncing}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition cursor-pointer disabled:opacity-50"
              >
                <Boxes className={`h-4 w-4 ${isExportingCatalog ? 'animate-spin' : ''}`} />
                <span>{isExportingCatalog ? 'Exportando Catálogo...' : 'Exportar Catálogo a Alegra'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncInventory}
                disabled={isSyncing || isExportingCatalog}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Traer Stock de Alegra'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">Artículo / Producto</th>
                    <th className="px-4 py-3.5 font-bold">Referencia / SKU</th>
                    <th className="px-4 py-3.5 font-bold text-right">Precio en Alegra</th>
                    <th className="px-4 py-3.5 font-bold text-right">Costo Unitario</th>
                    <th className="px-4 py-3.5 font-bold text-center">Stock Disponible</th>
                    <th className="px-4 py-3.5 font-bold text-center">Estado Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-400">
                        {status?.connected
                          ? 'No hay artículos de inventario registrados en tu cuenta de Alegra.'
                          : 'Conecta tu cuenta de Alegra para sincronizar los artículos y existencias reales.'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/40 transition">
                        <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                          {item.reference || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-zinc-900 dark:text-white">
                          ${item.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-right text-zinc-500 dark:text-zinc-400">
                          ${(item.inventory?.unitCost || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {item.inventory?.availableQuantity || 0} {item.inventory?.unit || 'uds'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Alegra API
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB CONTENT 4: CONFIGURACIÓN ================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Conexión Real con Alegra para la Tienda: {activeChannel?.customFields?.displayName || activeChannel?.code}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Ingresa tus credenciales oficiales de Alegra. Al presionar guardar, el sistema se comunicará en vivo con la API oficial de Alegra (<strong>https://api.alegra.com/api/v1/company</strong>) para validar el acceso. Si las credenciales son incorrectas, verás el error exacto que devuelve Alegra.
            </p>

            {configSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                <span>{configSuccess}</span>
              </div>
            )}

            {configError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{configError}</div>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Email de usuario de Alegra
                </label>
                <input
                  type="email"
                  value={alegraEmail}
                  onChange={(e) => setAlegraEmail(e.target.value)}
                  placeholder="tu-correo@empresa.com"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Token API de Alegra
                </label>
                <input
                  type="password"
                  value={alegraToken}
                  onChange={(e) => setAlegraToken(e.target.value)}
                  placeholder="Pega aquí tu token oficial de Alegra"
                  required
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-zinc-400">
                  ¿Dónde encuentro mi token? Inicia sesión en alegra.com y ve a: <strong>Configuración ➔ Desarrolladores ➔ API Token</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="autoSyncInventory"
                    checked={autoSyncInventory}
                    onChange={(e) => setAutoSyncInventory(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="autoSyncInventory" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      Sincronización Automática de Inventario, Productos y Variantes en Tiempo Real
                    </label>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Cualquier producto o variante creado o editado en Dokkany se replica automáticamente en Alegra. Los movimientos de stock y ventas descuentan el inventario en Alegra al instante.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="autoInvoice"
                    checked={autoInvoice}
                    onChange={(e) => setAutoInvoice(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="autoInvoice" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      Generar factura fiscal automáticamente en Alegra cuando una orden pase a Pagada
                    </label>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Emite comprobantes con los datos fiscales del cliente en Alegra cada vez que se confirme un pago.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Guardar y Probar Conexión Real</span>
                </button>

                {status?.connected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-zinc-700 dark:text-rose-400 dark:hover:bg-rose-950/30 transition cursor-pointer"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    <span>Desconectar Alegra</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NUEVA FACTURA ================= */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-500" />
              <span>Emitir Factura Real en Alegra</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Esta acción creará una factura oficial en tu cuenta de Alegra a través de la API.
            </p>

            <form onSubmit={handleCreateInvoice} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nombre del Cliente</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej. Juan Pérez / Empresa SRL"
                  required
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">RNC o Cédula</label>
                  <input
                    type="text"
                    value={newClientRnc}
                    onChange={(e) => setNewClientRnc(e.target.value)}
                    placeholder="131-00000-0"
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-white mb-2">Detalle de Artículo</p>
                <div>
                  <label className="block text-[11px] text-zinc-500">Nombre del Producto / Servicio</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Ej. Zapatos Deportivos Pro"
                    required
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] text-zinc-500">Precio Unitario ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoc}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingDoc && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Emitir en Alegra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NUEVA COTIZACIÓN ================= */}
      {showEstimateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowEstimateModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-purple-500" />
              <span>Crear Cotización Real en Alegra</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Esta acción creará una cotización oficial en tu cuenta de Alegra.
            </p>

            <form onSubmit={handleCreateEstimate} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Cliente a Cotizar</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej. Hotel Gran Bahía / Cliente Particular"
                  required
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">RNC o Cédula</label>
                  <input
                    type="text"
                    value={newClientRnc}
                    onChange={(e) => setNewClientRnc(e.target.value)}
                    placeholder="101-00000-0"
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="compras@cliente.com"
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-white mb-2">Ítem Cotizado</p>
                <div>
                  <label className="block text-[11px] text-zinc-500">Descripción del Artículo o Servicio</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Ej. Lote de Ropa Corporativa con Bordado"
                    required
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] text-zinc-500">Precio Unitario ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEstimateModal(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoc}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingDoc && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Crear en Alegra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
