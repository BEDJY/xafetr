import React, { useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import { X, Tag, Percent, DollarSign, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromotionCreated: () => void;
}

export const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  isOpen,
  onClose,
  onPromotionCreated,
}) => {
  const [name, setName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [enabled, setEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa un nombre para la promoción.');
      return;
    }

    if (discountValue <= 0) {
      setErrorMsg('El valor del descuento debe ser mayor a 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const actionCode = discountType === 'percent' ? 'order_percentage_discount' : 'order_fixed_discount';
      // In Vendure, fixed discount amount is in cents, percentage is float
      const actionValue = discountType === 'fixed' ? (discountValue * 100).toString() : discountValue.toString();

      const mutation = `
        mutation CreatePromotion($input: CreatePromotionInput!) {
          createPromotion(input: $input) {
            ... on Promotion {
              id
              name
              couponCode
              enabled
            }
          }
        }
      `;

      const input = {
        translations: [
          {
            languageCode: 'es',
            name: name.trim(),
            description: couponCode.trim() ? `Cupón de descuento: ${couponCode.trim()}` : 'Descuento automático en compras',
          },
        ],
        couponCode: couponCode.trim() ? couponCode.trim().toUpperCase() : null,
        enabled,
        conditions: [],
        actions: [
          {
            code: actionCode,
            arguments: [{ name: 'discount', value: actionValue }],
          },
        ],
      };

      const res = await VendureClient.request(mutation, { input });
      if (res?.createPromotion?.id) {
        setSuccessMsg(`¡Promoción "${name}" creada exitosamente!`);
        setName('');
        setCouponCode('');
        setDiscountValue(10);
        onPromotionCreated();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      } else {
        throw new Error('Respuesta inesperada al crear la promoción.');
      }
    } catch (err: any) {
      console.error('Error creating promotion:', err);
      setErrorMsg(err.message || 'Error al guardar la promoción');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Nueva Promoción / Cupón
              </h2>
              <p className="text-xs text-zinc-400">
                Crea ofertas automáticas o cupones canjeables en tu tienda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nombre de la Promoción *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Descuento 15% Clientes VIP"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Código de cupón */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Código de Cupón (Opcional)
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Ej: VIP15 (Dejar vacío para descuento automático)"
              className="w-full font-mono uppercase rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-zinc-400">
              Si se especifica, el cliente debe introducirlo en el checkout para que aplique.
            </p>
          </div>

          {/* Tipo de Descuento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tipo de Descuento
              </label>
              <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setDiscountType('percent')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                    discountType === 'percent'
                      ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  <Percent className="h-3.5 w-3.5 text-amber-500" />
                  <span>Porcentaje</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                    discountType === 'fixed'
                      ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Monto Fijo</span>
                </button>
              </div>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Valor del Descuento {discountType === 'percent' ? '(%)' : '($ USD)'} *
              </label>
              <input
                type="number"
                min="1"
                step={discountType === 'percent' ? '1' : '0.01'}
                max={discountType === 'percent' ? '100' : '99999'}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Enabled Switch */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">Estado Inicial Activo</p>
              <p className="text-[11px] text-zinc-400">La promoción estará lista para aplicarse inmediatamente</p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <span>Crear Promoción</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
