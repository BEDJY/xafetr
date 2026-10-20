import React from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

interface AddPaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPaymentGatewayModal: React.FC<AddPaymentGatewayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const gateways = [
    {
      name: 'Pago contra entrega (Efectivo / POS)',
      code: 'pago-contra-entrega',
      status: 'Activo & Integrado',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'El cliente paga al recibir su paquete. Se sincroniza con facturación automática en Alegra ERP.',
      badge: 'Recomendado',
    },
    {
      name: 'Transferencia Bancaria Directa',
      code: 'transferencia-bancaria',
      status: 'Activo & Integrado',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Banreservas, Banco Popular Dominicano, BHD León. Comprobante enviado por WhatsApp.',
      badge: 'RD',
    },
    {
      name: 'Stripe Payments',
      code: 'stripe-payment',
      status: 'Disponible con API Keys',
      statusColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      description: 'Acepta Visa, MasterCard, American Express, Apple Pay y Google Pay globalmente.',
      badge: 'Global',
    },
    {
      name: 'PayPal Checkout',
      code: 'paypal-payment',
      status: 'Disponible con API Keys',
      statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      description: 'Pagos con saldo PayPal o tarjetas de débito y crédito internacionales.',
      badge: 'Global',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pasarelas de Pago Disponibles</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ecosistema de cobros configurado en tu plataforma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {gateways.map((gw) => (
            <div
              key={gw.code}
              className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-2 transition hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{gw.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {gw.badge}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gw.statusColor}`}>
                  {gw.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {gw.description}
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400">
                <span>Código: {gw.code}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Encriptación TLS 256-bit y cumplimiento PCI-DSS</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
