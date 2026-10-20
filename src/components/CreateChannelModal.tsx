import React, { useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import { X, Store, AlertCircle, CheckCircle2, Loader2, Sparkles, Palette } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: () => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onChannelCreated,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#0ea5e9');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
    const sanitized = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setCode(sanitized);
    setToken(sanitized ? `${sanitized}-token` : '');
  };

  const presetColors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#18181b'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !token.trim()) {
      setErrorMsg('Por favor completa el código y token del canal.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const mutation = `
        mutation CreateChannel($input: CreateChannelInput!) {
          createChannel(input: $input) {
            id
            code
            token
            defaultCurrencyCode
            customFields {
              displayName
              brandColor
              tagline
            }
          }
        }
      `;

      const input = {
        code: code.trim().toLowerCase(),
        token: token.trim().toLowerCase(),
        defaultCurrencyCode: currencyCode,
        availableCurrencyCodes: [currencyCode],
        defaultLanguageCode: 'es',
        availableLanguageCodes: ['es', 'en'],
        pricesIncludeTax: false,
        defaultTaxZoneId: '5',
        defaultShippingZoneId: '5',
        customFields: {
          displayName: displayName.trim() || code.trim(),
          brandColor: brandColor.trim(),
          tagline: tagline.trim(),
          themeMode: 'auto',
        },
      };

      const res = await VendureClient.request(mutation, { input });
      if (res?.createChannel?.id) {
        setSuccessMsg(`¡Tienda / Canal "${displayName || code}" creado exitosamente!`);
        setDisplayName('');
        setCode('');
        setToken('');
        setTagline('');
        onChannelCreated();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      } else {
        throw new Error('No se pudo crear el canal.');
      }
    } catch (err: any) {
      console.error('Error creating channel:', err);
      setErrorMsg(err.message || 'Error al guardar el canal de venta');
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Nueva Tienda / Canal Multi-Tenant
              </h2>
              <p className="text-xs text-zinc-400">
                Añade una nueva marca o comercio independiente al ecosistema
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
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nombre Comercial de la Tienda *
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => handleDisplayNameChange(e.target.value)}
              placeholder="Ej: Cobaii Store, CyberTech Labs"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Código Interno *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toLowerCase())}
                placeholder="cobaii-store"
                className="w-full font-mono rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Token de Tienda (API) *
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="cobaii-token"
                className="w-full font-mono rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-sky-500 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Eslogan o Descripción Corta
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ej: Tu tienda especializada en tecnología y estilo de vida"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Color de Marca y Moneda */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                <Palette className="h-3.5 w-3.5" />
                Color de Marca (HEX)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full font-mono rounded-xl border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="mt-2 flex gap-1.5">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBrandColor(c)}
                    className="h-4 w-4 rounded-full border border-black/10 transition hover:scale-110"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Moneda Principal
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white cursor-pointer"
              >
                <option value="USD">USD ($ - Dólar Estadounidense)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="MXN">MXN ($ - Peso Mexicano)</option>
                <option value="COP">COP ($ - Peso Colombiano)</option>
                <option value="ARS">ARS ($ - Peso Argentino)</option>
              </select>
            </div>
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
                  <span>Creando Tienda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Crear Tienda / Canal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
