import React, { useEffect, useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CustomerDetailModalProps {
  customerId: string | null;
  onClose: () => void;
  onSelectOrder?: (orderId: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customerId,
  onClose,
  onSelectOrder,
}) => {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId);
    } else {
      setCustomer(null);
    }
  }, [customerId]);

  const fetchCustomer = async (id: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const query = `
        query GetCustomerDetail($id: ID!) {
          customer(id: $id) {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            createdAt
            addresses {
              id
              fullName
              streetLine1
              streetLine2
              city
              province
              postalCode
              country {
                name
                code
              }
              defaultShippingAddress
              defaultBillingAddress
            }
            orders(options: { take: 20 }) {
              items {
                id
                code
                state
                totalWithTax
                currencyCode
                createdAt
              }
            }
          }
        }
      `;
      const res = await VendureClient.request(query, { id });
      if (res?.customer) {
        setCustomer(res.customer);
      } else {
        setErrorMsg('No se encontró información del cliente.');
      }
    } catch (err: any) {
      console.error('Error fetching customer:', err);
      setErrorMsg(err.message || 'Error al consultar datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                {customer ? `${customer.firstName} ${customer.lastName}` : 'Perfil del Cliente'}
              </h2>
              <p className="text-xs text-zinc-400">
                Historial de compras, pedidos y libreta de direcciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <Clock className="h-6 w-6 animate-spin text-purple-500" />
              <p className="text-xs">Cargando perfil...</p>
            </div>
          </div>
        ) : customer ? (
          <div className="mt-5 space-y-6">
            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  <Mail className="h-3.5 w-3.5" />
                  Correo
                </span>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                  {customer.emailAddress}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  <Phone className="h-3.5 w-3.5" />
                  Teléfono
                </span>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {customer.phoneNumber || 'No registrado'}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Registrado el
                </span>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            {/* Orders history */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                <ShoppingBag className="h-4 w-4 text-sky-500" />
                Historial de Pedidos ({customer.orders?.items?.length || 0})
              </h3>
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                    <tr>
                      <th className="px-3.5 py-2">Código</th>
                      <th className="px-3.5 py-2">Estado</th>
                      <th className="px-3.5 py-2 text-right">Total</th>
                      <th className="px-3.5 py-2 text-right">Fecha</th>
                      <th className="px-3.5 py-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {customer.orders?.items && customer.orders.items.length > 0 ? (
                      customer.orders.items.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-500">
                            {ord.code}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold dark:border-zinc-700 dark:bg-zinc-800">
                              {ord.state}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-bold text-zinc-900 dark:text-white">
                            ${(ord.totalWithTax / 100).toFixed(2)} {ord.currencyCode}
                          </td>
                          <td className="px-3.5 py-2.5 text-right text-zinc-400">
                            {new Date(ord.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            {onSelectOrder && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectOrder(ord.id);
                                }}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>Ver</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-zinc-400 italic">
                          Este cliente aún no ha realizado pedidos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Libreta de Direcciones ({customer.addresses?.length || 0})
              </h3>
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customer.addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-850 space-y-1"
                    >
                      <p className="font-bold text-zinc-900 dark:text-white">{addr.fullName}</p>
                      <p className="text-zinc-500">{addr.streetLine1} {addr.streetLine2 || ''}</p>
                      <p className="text-zinc-400">
                        {addr.city}, {addr.province || ''} {addr.postalCode || ''}
                      </p>
                      <p className="font-mono text-[10px] text-zinc-400 uppercase">
                        {addr.country?.name || addr.country?.code || ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">No hay direcciones registradas.</p>
              )}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
