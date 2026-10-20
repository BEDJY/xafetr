import React, { useEffect, useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import {
  X,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Truck,
  Send,
} from 'lucide-react';

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
  onOrderUpdated,
}) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('PedidosYa');
  const [trackingCode, setTrackingCode] = useState('');

  const handleSendWhatsAppNotification = () => {
    if (!order) return;
    const phone = order.customer?.phoneNumber || order.shippingAddress?.phoneNumber || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Estimado cliente';
    const totalFormatted = (order.totalWithTax / 100).toFixed(2);
    const trackingText = trackingCode ? ` (Guía de rastreo: ${trackingCode})` : '';
    const msg = `¡Hola ${customerName}! Tu pedido *#${order.code}* por valor de $${totalFormatted} ${order.currencyCode} ha sido preparado y enviado con *${carrier}*${trackingText}. ¡Gracias por preferirnos!`;
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const fetchOrderDetail = async (id: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const query = `
        query GetOrderDetail($id: ID!) {
          order(id: $id) {
            id
            code
            state
            nextStates
            totalWithTax
            shippingWithTax
            currencyCode
            createdAt
            orderPlacedAt
            customer {
              id
              firstName
              lastName
              emailAddress
              phoneNumber
            }
            shippingAddress {
              fullName
              streetLine1
              streetLine2
              city
              province
              postalCode
              country
              phoneNumber
            }
            lines {
              id
              quantity
              linePriceWithTax
              unitPriceWithTax
              productVariant {
                id
                name
                sku
                featuredAsset {
                  preview
                }
              }
            }
            payments {
              id
              method
              amount
              state
              transactionId
              createdAt
              errorMessage
            }
          }
        }
      `;
      const res = await VendureClient.request(query, { id });
      if (res?.order) {
        setOrder(res.order);
      } else {
        setErrorMsg('No se pudo encontrar la información detallada de la orden.');
      }
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      setErrorMsg(err.message || 'Error al consultar la orden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    } else {
      setOrder(null);
    }
  }, [orderId]);

  const handleTransition = async (nextState: string) => {
    if (!orderId) return;
    setTransitioning(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const mutation = `
        mutation TransitionOrder($id: ID!, $state: String!) {
          transitionOrderToState(id: $id, state: $state) {
            ... on Order {
              id
              state
              nextStates
            }
            ... on OrderStateTransitionError {
              errorCode
              message
              transitionError
            }
          }
        }
      `;
      const res = await VendureClient.request(mutation, { id: orderId, state: nextState });
      const result = res?.transitionOrderToState;
      if (result?.__typename === 'OrderStateTransitionError' || result?.transitionError) {
        throw new Error(result.message || result.transitionError || 'Error al cambiar de estado');
      }

      setSuccessMsg(`Estado actualizado a: ${nextState}`);
      await fetchOrderDetail(orderId);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      console.error('Error transitioning order:', err);
      setErrorMsg(err.message || 'Error en la transición de estado');
    } finally {
      setTransitioning(false);
    }
  };

  if (!orderId) return null;

  const stateLabels: Record<string, { label: string; bg: string; text: string }> = {
    AddingItems: { label: 'Agregando Productos', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-500' },
    ArrangingPayment: { label: 'En Proceso de Pago', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-500' },
    PaymentAuthorized: { label: 'Pago Autorizado', bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400' },
    PaymentSettled: { label: 'Pago Confirmado', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-500' },
    PartiallyShipped: { label: 'Parcialmente Enviado', bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400' },
    Shipped: { label: 'Enviado', bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-400' },
    Delivered: { label: 'Entregado al Cliente', bg: 'bg-green-500/15 border-green-500/30', text: 'text-green-500' },
    Cancelled: { label: 'Cancelado', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-500' },
  };

  const getFriendlyTransitionLabel = (state: string) => {
    switch (state) {
      case 'ArrangingPayment':
        return '💳 Proceder al Pago';
      case 'PaymentSettled':
        return '✅ Confirmar Pago';
      case 'Shipped':
        return '🚚 Despachar / Enviar';
      case 'Delivered':
        return '🎉 Marcar Entregado';
      case 'Cancelled':
        return '❌ Cancelar Pedido';
      case 'Modifying':
        return '✏️ Modificar';
      default:
        return `Pasar a ${state}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Pedido <span className="font-mono text-sky-500">#{order?.code || orderId}</span>
              </h2>
              {order && (
                <span
                  className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${
                    stateLabels[order.state]?.bg || 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  } ${stateLabels[order.state]?.text || ''}`}
                >
                  {stateLabels[order.state]?.label || order.state}
                </span>
              )}
            </div>
            {order?.createdAt && (
              <p className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                Fecha: {new Date(order.createdAt).toLocaleString('es-ES')}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <Clock className="h-7 w-7 animate-spin text-sky-500" />
              <p className="text-xs">Cargando detalles del pedido...</p>
            </div>
          </div>
        ) : order ? (
          <div className="mt-5 space-y-6">
            {/* Workflow Action Bar */}
            {order.nextStates && order.nextStates.length > 0 && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 dark:bg-sky-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Flujo de Trabajo & Cambio de Estado
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Avanza este pedido al siguiente estado disponible según las reglas de negocio de Vendure.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.nextStates.map((st: string) => (
                      <button
                        key={st}
                        onClick={() => handleTransition(st)}
                        disabled={transitioning}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                          st === 'Cancelled'
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white'
                            : 'bg-sky-600 text-white hover:bg-sky-700'
                        }`}
                      >
                        {transitioning ? (
                          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5" />
                        )}
                        <span>{getFriendlyTransitionLabel(st)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  <Package className="h-4 w-4 text-sky-500" />
                  Cliente
                </h4>
                {order.customer ? (
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-zinc-500">{order.customer.emailAddress}</p>
                    {order.customer.phoneNumber && (
                      <p className="text-zinc-400">{order.customer.phoneNumber}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">Cliente invitado (sin cuenta registrada)</p>
                )}
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  Dirección de Entrega
                </h4>
                {order.shippingAddress && (order.shippingAddress.streetLine1 || order.shippingAddress.city) ? (
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {order.shippingAddress.fullName || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`}
                    </p>
                    <p>{order.shippingAddress.streetLine1} {order.shippingAddress.streetLine2 || ''}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.province || ''} {order.shippingAddress.postalCode || ''}
                    </p>
                    <p className="font-mono text-[11px] text-zinc-400 uppercase">{order.shippingAddress.country || 'N/A'}</p>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No se especificó dirección de envío física.</p>
                )}
              </div>
            </div>

            {/* Logistics & Dispatch Controls */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-700/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-sky-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Despacho & Notificación al Cliente
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleSendWhatsAppNotification}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>📲 Notificar por WhatsApp</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    Empresa de Envíos / Repartidor
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="PedidosYa">PedidosYa (Express)</option>
                    <option value="MetroPac">MetroPac Envíos</option>
                    <option value="Caribe Tours">Caribe Tours Expreso</option>
                    <option value="Repartidor Propio">Repartidor Propio de Tienda</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Retiro en Tienda">Retiro en Tienda / Pick-up</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    Número de Guía / Tracking
                  </label>
                  <input
                    type="text"
                    placeholder="ej: MP-98214 o PY-5541"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Productos Comprados ({order.lines?.length || 0})
              </h4>
              <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                    <tr>
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5 text-center">Cant.</th>
                      <th className="px-4 py-2.5 text-right">Precio Unit.</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {order.lines?.map((line: any) => (
                      <tr key={line.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                              <img
                                src={
                                  line.productVariant?.featuredAsset?.preview ||
                                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60'
                                }
                                alt={line.productVariant?.name || 'Producto'}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              {line.productVariant?.name || 'Variante'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">
                          {line.productVariant?.sku || '—'}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-zinc-800 dark:text-zinc-200">
                          {line.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-500">
                          ${(line.unitPriceWithTax / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-zinc-900 dark:text-white">
                          ${(line.linePriceWithTax / 100).toFixed(2)} {order.currencyCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total and Summary */}
            <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Envío:</span>
                  <span>${((order.shippingWithTax || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                  <span>Total con Impuestos:</span>
                  <span className="text-sky-500">
                    ${(order.totalWithTax / 100).toFixed(2)} {order.currencyCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Payments List */}
            {order.payments && order.payments.length > 0 && (
              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  <CreditCard className="h-4 w-4 text-purple-500" />
                  Registro de Pagos ({order.payments.length})
                </h4>
                <div className="space-y-2">
                  {order.payments.map((p: any) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-850"
                    >
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{p.method}</p>
                        <p className="text-[11px] text-zinc-400">ID Transacción: {p.transactionId || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                          {p.state}
                        </span>
                        <p className="mt-1 font-bold text-zinc-900 dark:text-white">
                          ${(p.amount / 100).toFixed(2)} {order.currencyCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
