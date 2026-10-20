import React, { useState } from 'react';
import {
  X,
  Truck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { VendureClient } from '../services/vendureClient';

interface CreateShippingMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateShippingMethodModal: React.FC<CreateShippingMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('200'); // Monto en moneda principal (ej: 200 DOP)
  const [orderMinimum, setOrderMinimum] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const sanitized = val
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setCode(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setErrorMsg('Por favor ingresa el nombre y código del método de envío.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const rateCents = Math.round(parseFloat(rate || '0') * 100);
      const minCents = Math.round(parseFloat(orderMinimum || '0') * 100);

      const mutation = `
        mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
          createShippingMethod(input: $input) {
            id
            code
            name
            description
          }
        }
      `;

      const input = {
        code: code.trim(),
        translations: [
          {
            languageCode: 'es',
            name: name.trim(),
            description: description.trim() || 'Servicio de entrega a domicilio',
          },
        ],
        checker: {
          code: 'default-shipping-eligibility-checker',
          arguments: [
            {
              name: 'orderMinimum',
              value: String(minCents),
            },
          ],
        },
        calculator: {
          code: 'default-shipping-calculator',
          arguments: [
            {
              name: 'rate',
              value: String(rateCents),
            },
            {
              name: 'includesTax',
              value: 'auto',
            },
            {
              name: 'taxRate',
              value: '0',
            },
          ],
        },
      };

      await VendureClient.request(mutation, { input });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating shipping method:', err);
      setErrorMsg(err.message || 'Error al registrar el método de envío en Vendure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Nuevo Método de Envío</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configura tarifas de entrega, zonas o mensajería propia
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

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Nombre Comercial del Envío *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Envío Express Santo Domingo (24h), Delivery Nacional"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Identificador Interno (Código / Slug) *
            </label>
            <input
              type="text"
              required
              placeholder="ej: envio-express-sd"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Tarifa / Costo de Envío *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="250.00"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-7 pr-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Pedido Mínimo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00 (sin mínimo)"
                  value={orderMinimum}
                  onChange={(e) => setOrderMinimum(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-7 pr-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Descripción / Instrucciones de Entrega
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Entregas de lunes a sábado de 9:00 AM a 6:00 PM."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/30 hover:bg-sky-500 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Crear Método de Envío</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
