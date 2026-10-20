import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { OrderDetailModal } from '../../components/OrderDetailModal';
import { AssetUploadModal } from '../../components/AssetUploadModal';
import { AssetPreviewModal } from '../../components/AssetPreviewModal';
import { CreatePromotionModal } from '../../components/CreatePromotionModal';
import { CreateAdministratorModal } from '../../components/CreateAdministratorModal';
import { CreateCollectionModal } from '../../components/CreateCollectionModal';
import { CreateChannelModal } from '../../components/CreateChannelModal';
import { CustomerDetailModal } from '../../components/CustomerDetailModal';
import { CreateShippingMethodModal } from '../../components/CreateShippingMethodModal';
import { AddPaymentGatewayModal } from '../../components/AddPaymentGatewayModal';
import {
  ShoppingCart,
  FolderTree,
  Users,
  Store,
  Shield,
  Layers,
  Image,
  Tag,
  Truck,
  CreditCard,
  Eye,
} from 'lucide-react';

/* =========================================================================
 * 1. PÁGINA DE PEDIDOS (ORDERS)
 * ========================================================================= */
export const OrdersPage: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const query = `
    query GetOrders {
      orders(options: { take: 50 }) {
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
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Gestión de Pedidos"
        subtitle="Revisa y gestiona los pedidos recibidos en tu tienda (haz clic en cualquier fila para gestionar el flujo de entrega y pagos)"
        icon={ShoppingCart}
        query={query}
        queryResultKey="orders"
        onRowClick={(row) => setSelectedOrderId(row.id)}
        columns={[
          {
            header: 'Código de Orden',
            accessorKey: 'code',
            cell: (row: any) => (
              <span className="font-mono font-bold text-sky-500 hover:underline">{row.code}</span>
            ),
          },
          {
            header: 'Cliente',
            cell: (row: any) => (
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : 'Cliente Invitado'}
                </p>
                <p className="text-[11px] text-zinc-400">{row.customer?.emailAddress || '-'}</p>
              </div>
            ),
          },
          {
            header: 'Estado',
            cell: (row: any) => {
              const state = row.state;
              const colors: Record<string, string> = {
                PaymentSettled: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
                Shipped: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
                AddingItems: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
                Cancelled: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
              };
              return (
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                    colors[state] || 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {state}
                </span>
              );
            },
          },
          {
            header: 'Total',
            cell: (row: any) => (
              <span className="font-bold text-zinc-900 dark:text-white">
                ${(row.totalWithTax / 100).toFixed(2)} {row.currencyCode}
              </span>
            ),
          },
          {
            header: 'Fecha',
            cell: (row: any) => (
              <span className="text-zinc-500">
                {new Date(row.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            ),
          },
          {
            header: 'Acciones',
            cell: (row: any) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrderId(row.id);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
              >
                <Eye className="h-3.5 w-3.5 text-sky-500" />
                <span>Ver Detalle</span>
              </button>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'ord-1',
            code: 'ORD-78921',
            state: 'PaymentSettled',
            totalWithTax: 12999,
            currencyCode: 'USD',
            createdAt: new Date().toISOString(),
            customer: { firstName: 'Carlos', lastName: 'Gómez', emailAddress: 'carlos@example.com' },
          },
          {
            id: 'ord-2',
            code: 'ORD-78922',
            state: 'Shipped',
            totalWithTax: 4500,
            currencyCode: 'USD',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            customer: { firstName: 'María', lastName: 'López', emailAddress: 'maria@example.com' },
          },
        ]}
      />

      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onOrderUpdated={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />
    </>
  );
};

/* =========================================================================
 * 2. PÁGINA DE COLECCIONES (COLLECTIONS & FLASH SALES)
 * ========================================================================= */
export const CollectionsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = `
    query GetCollections {
      collections(options: { take: 50 }) {
        items {
          id
          name
          slug
          isPrivate
          filters {
            code
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Colecciones de Catálogo"
        subtitle="Organiza productos y colecciones dinámicas de Ofertas Flash"
        icon={FolderTree}
        query={query}
        queryResultKey="collections"
        actionButtonText="Nueva Colección"
        onActionButtonClick={() => setIsCreateOpen(true)}
        columns={[
          {
            header: 'Nombre',
            cell: (row: any) => {
              const isFlash = row.filters?.some((f: any) => f.code.includes('flash-sale'));
              return (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
                  {isFlash && (
                    <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-black">
                      ⚡ OFERTAS FLASH
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            header: 'Slug / URL',
            accessorKey: 'slug',
            cell: (row: any) => <span className="font-mono text-zinc-500">/{row.slug}</span>,
          },
          {
            header: 'Visibilidad',
            cell: (row: any) => (
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                  row.isPrivate
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {row.isPrivate ? 'Privada' : 'Pública'}
              </span>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'col-1',
            name: '⚡ Ofertas Flash',
            slug: 'ofertas-flash',
            isPrivate: false,
            filters: [{ code: 'flash-sale-collection-filter' }],
          },
          {
            id: 'col-2',
            name: 'Electrónica & Gadgets',
            slug: 'electronica',
            isPrivate: false,
            filters: [],
          },
        ]}
      />

      <CreateCollectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCollectionCreated={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />
    </>
  );
};

/* =========================================================================
 * 3. PÁGINA DE CLIENTES (CUSTOMERS)
 * ========================================================================= */
export const CustomersPage: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const query = `
    query GetCustomers {
      customers(options: { take: 50 }) {
        items {
          id
          firstName
          lastName
          emailAddress
          user {
            verified
          }
          createdAt
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Clientes"
        subtitle="Directorio de clientes registrados y compradores de la tienda (haz clic en cualquier fila para ver historial de compras y direcciones)"
        icon={Users}
        query={query}
        queryResultKey="customers"
        onRowClick={(row) => setSelectedCustomerId(row.id)}
        columns={[
          {
            header: 'Nombre',
            cell: (row: any) => (
              <span className="font-bold text-zinc-900 dark:text-white hover:text-sky-500">
                {row.firstName} {row.lastName}
              </span>
            ),
          },
          {
            header: 'Correo Electrónico',
            accessorKey: 'emailAddress',
            cell: (row: any) => <span className="text-zinc-600 dark:text-zinc-300">{row.emailAddress}</span>,
          },
          {
            header: 'Estado de Cuenta',
            cell: (row: any) => (
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                  row.user?.verified
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                }`}
              >
                {row.user?.verified ? 'Verificado' : 'Pendiente'}
              </span>
            ),
          },
          {
            header: 'Registrado',
            cell: (row: any) => (
              <span className="text-zinc-400">
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            header: 'Acción',
            cell: (row: any) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomerId(row.id);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
              >
                <Eye className="h-3.5 w-3.5 text-purple-500" />
                <span>Ver Perfil</span>
              </button>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'cust-1',
            firstName: 'Juan',
            lastName: 'Pérez',
            emailAddress: 'juan.perez@example.com',
            user: { verified: true },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cust-2',
            firstName: 'Laura',
            lastName: 'Méndez',
            emailAddress: 'laura@example.com',
            user: { verified: false },
            createdAt: new Date().toISOString(),
          },
        ]}
      />

      <CustomerDetailModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </>
  );
};

/* =========================================================================
 * 4. PÁGINA DE TIENDAS Y CANALES (CHANNELS)
 * ========================================================================= */
export const ChannelsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = `
    query GetChannels {
      channels {
        items {
          id
          code
          token
          defaultCurrencyCode
          customFields {
            displayName
            brandColor
            tagline
            themeMode
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Tiendas & Canales"
        subtitle="Ecosistema multi-tienda: administra canales, tokens y marcas de cada comercio"
        icon={Store}
        query={query}
        queryResultKey="channels"
        actionButtonText="Crear Tienda / Canal"
        onActionButtonClick={() => setIsCreateOpen(true)}
        columns={[
          {
            header: 'Nombre Comercial',
            cell: (row: any) => (
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: row.customFields?.brandColor || '#0ea5e9' }}
                />
                <span className="font-bold text-zinc-900 dark:text-white">
                  {row.customFields?.displayName || row.code}
                </span>
              </div>
            ),
          },
          {
            header: 'Código',
            accessorKey: 'code',
            cell: (row: any) => <span className="font-mono text-zinc-500">{row.code}</span>,
          },
          {
            header: 'Token de Tienda',
            accessorKey: 'token',
            cell: (row: any) => <span className="font-mono text-xs text-sky-500">{row.token}</span>,
          },
          {
            header: 'Moneda',
            accessorKey: 'defaultCurrencyCode',
          },
        ]}
      />

      <CreateChannelModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onChannelCreated={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />
    </>
  );
};

/* =========================================================================
 * 5. PÁGINA DE ADMINISTRADORES Y ROLES (ADMINISTRATORS)
 * ========================================================================= */
export const AdministratorsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = `
    query GetAdministrators {
      administrators(options: { take: 50 }) {
        items {
          id
          firstName
          lastName
          emailAddress
          user {
            roles {
              code
              description
            }
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Administradores & Roles"
        subtitle="Control de acceso, permisos y cuentas administrativas de Vendure"
        icon={Shield}
        query={query}
        queryResultKey="administrators"
        actionButtonText="Nuevo Administrador"
        onActionButtonClick={() => setIsCreateOpen(true)}
        columns={[
          {
            header: 'Administrador',
            cell: (row: any) => (
              <span className="font-bold text-zinc-900 dark:text-white">
                {row.firstName} {row.lastName}
              </span>
            ),
          },
          {
            header: 'Email / Usuario',
            accessorKey: 'emailAddress',
            cell: (row: any) => <span className="text-zinc-500">{row.emailAddress}</span>,
          },
          {
            header: 'Roles Asignados',
            cell: (row: any) => (
              <div className="flex flex-wrap gap-1">
                {row.user?.roles?.map((r: any, rIdx: number) => (
                  <span
                    key={rIdx}
                    className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400"
                  >
                    {r.code}
                  </span>
                ))}
              </div>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'admin-1',
            firstName: 'Super',
            lastName: 'Admin',
            emailAddress: 'admin@dobeha.com',
            user: { roles: [{ code: 'superadmin', description: 'Super Administrador Global' }] },
          },
        ]}
      />

      <CreateAdministratorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAdminCreated={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />
    </>
  );
};

/* =========================================================================
 * 6. PÁGINA DE COLAS DE TRABAJO (JOB QUEUE)
 * ========================================================================= */
export const JobQueuePage: React.FC = () => {
  const query = `
    query GetJobQueues {
      jobQueues {
        name
        running
      }
    }
  `;

  return (
    <VendureDataView
      title="Colas de Trabajo (Job Queues)"
      subtitle="Supervisa procesos en segundo plano: sincronización de ofertas flash, emails y re-indexación"
      icon={Layers}
      query={query}
      queryResultKey="jobQueues"
      columns={[
        {
          header: 'Nombre de la Cola',
          accessorKey: 'name',
          cell: (row: any) => <span className="font-bold font-mono text-zinc-900 dark:text-white">{row.name}</span>,
        },
        {
          header: 'Estado de Ejecución',
          cell: (row: any) => (
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                row.running
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 animate-pulse'
                  : 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800'
              }`}
            >
              {row.running ? '⚡ En Ejecución' : 'Inactivo / En espera'}
            </span>
          ),
        },
      ]}
      mockFallback={[
        { name: 'apply-collection-filters', running: true },
        { name: 'send-email-queue', running: false },
        { name: 'update-search-index', running: false },
      ]}
    />
  );
};

/* =========================================================================
 * 7. PÁGINA DE MULTIMEDIA (ASSETS / CLOUDFLARE R2)
 * ========================================================================= */
export const AssetsPage: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const query = `
    query GetAssets {
      assets(options: { take: 50 }) {
        items {
          id
          name
          preview
          source
          fileSize
          mimeType
          width
          height
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Multimedia & Assets (Cloudflare R2)"
        subtitle="Galería de imágenes y recursos optimizados alojados en Cloudflare R2 / S3 (haz clic en cualquier archivo para previsualizarlo y copiar su URL)"
        icon={Image}
        query={query}
        queryResultKey="assets"
        actionButtonText="Subir Archivo"
        onActionButtonClick={() => setIsUploadOpen(true)}
        onRowClick={(row) => setSelectedAsset(row)}
        columns={[
          {
            header: 'Vista Previa',
            accessorKey: 'preview',
            cell: (row: any) => (
              <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                <img
                  src={row.preview || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60'}
                  alt={row.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60';
                  }}
                />
              </div>
            ),
          },
          {
            header: 'Nombre del Archivo',
            accessorKey: 'name',
            cell: (row: any) => (
              <span className="font-semibold text-zinc-900 dark:text-white hover:text-sky-500">
                {row.name}
              </span>
            ),
          },
          {
            header: 'Dimensiones',
            cell: (row: any) => (
              <span className="text-xs text-zinc-500 font-mono">
                {row.width && row.height ? `${row.width} × ${row.height} px` : '—'}
              </span>
            ),
          },
          {
            header: 'Tipo MIME',
            accessorKey: 'mimeType',
            cell: (row: any) => (
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {row.mimeType || 'image/jpeg'}
              </span>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'asset-1',
            name: 'reloj-vintage-aurora.jpg',
            preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=60',
            fileSize: 45200,
            mimeType: 'image/jpeg',
            width: 800,
            height: 800,
          },
          {
            id: 'asset-2',
            name: 'audifonos-pro-inalambricos.jpg',
            preview: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=60',
            fileSize: 68100,
            mimeType: 'image/jpeg',
            width: 1024,
            height: 768,
          },
        ]}
      />

      <AssetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />

      <AssetPreviewModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </>
  );
};

/* =========================================================================
 * 8. PÁGINA DE PROMOCIONES Y CUPONES
 * ========================================================================= */
export const PromotionsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = `
    query GetPromotions {
      promotions(options: { take: 50 }) {
        items {
          id
          name
          enabled
          couponCode
          startsAt
          endsAt
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Promociones y Cupones de Descuento"
        subtitle="Reglas automáticas de descuento, cupones de compra y promociones activas"
        icon={Tag}
        query={query}
        queryResultKey="promotions"
        actionButtonText="Nueva Promoción"
        onActionButtonClick={() => setIsCreateOpen(true)}
        columns={[
          {
            header: 'Nombre de Promoción',
            accessorKey: 'name',
            cell: (row: any) => <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>,
          },
          {
            header: 'Cupón',
            accessorKey: 'couponCode',
            cell: (row: any) => (
              row.couponCode ? (
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-500">
                  {row.couponCode}
                </span>
              ) : (
                <span className="text-xs text-zinc-400 italic">Descuento Automático</span>
              )
            ),
          },
          {
            header: 'Estado',
            cell: (row: any) => (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  row.enabled
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                }`}
              >
                {row.enabled ? 'Activa' : 'Pausada'}
              </span>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'promo-1',
            name: 'Descuento Bienvenida 10%',
            couponCode: 'BIENVENIDA10',
            enabled: true,
          },
          {
            id: 'promo-2',
            name: 'Envío Gratis por Compras mayores a $50',
            couponCode: null,
            enabled: true,
          },
        ]}
      />

      <CreatePromotionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPromotionCreated={() => {
          window.dispatchEvent(new CustomEvent('channel-changed'));
        }}
      />
    </>
  );
};

/* =========================================================================
 * 9. PÁGINA DE MÉTODOS DE ENVÍO
 * ========================================================================= */
export const ShippingMethodsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const query = `
    query GetShippingMethods {
      shippingMethods(options: { take: 50 }) {
        items {
          id
          code
          name
          description
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Métodos de Envío (Shipping)"
        subtitle="Configura transportistas, tarifas planas, envíos nacionales e internacionales"
        icon={Truck}
        query={query}
        queryResultKey="shippingMethods"
        actionButtonText="Nuevo Método de Envío"
        onActionButtonClick={() => setIsCreateModalOpen(true)}
        columns={[
          {
            header: 'Método',
            accessorKey: 'name',
            cell: (row: any) => <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>,
          },
          {
            header: 'Código',
            accessorKey: 'code',
            cell: (row: any) => <span className="font-mono text-xs text-zinc-500">{row.code}</span>,
          },
          {
            header: 'Descripción',
            accessorKey: 'description',
            cell: (row: any) => <span className="text-xs text-zinc-500">{row.description || 'Tarifa estándar'}</span>,
          },
        ]}
        mockFallback={[
          {
            id: 'ship-1',
            code: 'standard-shipping',
            name: 'Envío Estándar (3 a 5 días)',
            description: 'Entrega estándar a todo el país',
          },
          {
            id: 'ship-2',
            code: 'express-shipping',
            name: 'Envío Express 24h',
            description: 'Entrega prioritaria express',
          },
        ]}
      />
      <CreateShippingMethodModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => window.dispatchEvent(new CustomEvent('channel-changed'))}
      />
    </>
  );
};

/* =========================================================================
 * 10. PÁGINA DE MÉTODOS DE PAGO
 * ========================================================================= */
export const PaymentMethodsPage: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const togglePaymentMethod = async (id: string, currentEnabled: boolean) => {
    try {
      await VendureClient.request(`
        mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
          updatePaymentMethod(input: $input) {
            id
            enabled
          }
        }
      `, {
        input: {
          id,
          enabled: !currentEnabled,
        },
      });
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      alert(err.message || 'Error al actualizar pasarela de pago');
    }
  };

  const query = `
    query GetPaymentMethods {
      paymentMethods(options: { take: 50 }) {
        items {
          id
          code
          name
          enabled
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView
        title="Métodos de Pago (Gateways)"
        subtitle="Pasarelas integradas: Stripe, PayPal, Transferencias bancarias y Efectivo (haz clic en el estado para activar/desactivar)"
        icon={CreditCard}
        query={query}
        queryResultKey="paymentMethods"
        actionButtonText="Ver Pasarelas Disponibles"
        onActionButtonClick={() => setIsInfoModalOpen(true)}
        columns={[
          {
            header: 'Nombre',
            accessorKey: 'name',
            cell: (row: any) => <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>,
          },
          {
            header: 'Código Interno',
            accessorKey: 'code',
            cell: (row: any) => <span className="font-mono text-xs text-zinc-500">{row.code}</span>,
          },
          {
            header: 'Estado',
            cell: (row: any) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePaymentMethod(row.id, row.enabled);
                }}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition hover:scale-105 cursor-pointer ${
                  row.enabled
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500/20'
                }`}
                title="Haz clic para cambiar el estado"
              >
                {row.enabled ? '✓ Habilitado' : '✗ Deshabilitado'}
              </button>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'pay-1',
            code: 'stripe-payment',
            name: 'Tarjetas de Crédito / Débito (Stripe)',
            enabled: true,
          },
          {
            id: 'pay-2',
            code: 'standard-payment',
            name: 'Transferencia Bancaria Directa',
            enabled: true,
          },
        ]}
      />
      <AddPaymentGatewayModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </>
  );
};
