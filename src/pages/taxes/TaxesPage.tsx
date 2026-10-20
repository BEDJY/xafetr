import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Receipt, Percent, Plus, X, AlertCircle, Loader2 } from 'lucide-react';

interface TaxRate {
  id: string;
  name: string;
  value: number;
  enabled: boolean;
  category?: { id: string; name: string };
  zone?: { id: string; name: string };
}

export const TaxesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('18'); // Default 18% para ITBIS dominicano / IVA
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTaxRate = async (id: string, currentEnabled: boolean) => {
    try {
      await VendureClient.request(`
        mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
          updateTaxRate(input: $input) {
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
      alert(err.message || 'Error al actualizar tasa impositiva');
    }
  };

  const handleCreateTaxRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la tasa impositiva.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateTaxRate($input: CreateTaxRateInput!) {
          createTaxRate(input: $input) {
            id
            name
            value
            enabled
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          name: name.trim(),
          value: parseFloat(value || '0'),
          enabled: true,
          categoryId: '1', // Standard Tax Category por defecto
          zoneId: '5', // Americas por defecto
        },
      });

      setIsModalOpen(false);
      setName('');
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la tasa de impuestos.');
    } finally {
      setIsLoading(false);
    }
  };

  const query = `
    query GetTaxRates {
      taxRates(options: { take: 50 }) {
        items {
          id
          name
          value
          enabled
          category {
            id
            name
          }
          zone {
            id
            name
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView<TaxRate>
        title="Impuestos & Tasas Impositivas (ITBIS / IVA)"
        subtitle="Configura porcentajes de impuestos fiscales, categorías de productos gravados y exentos para facturación legal"
        icon={Receipt}
        query={query}
        queryResultKey="taxRates"
        actionButtonText="Nueva Tasa Impositiva"
        onActionButtonClick={() => setIsModalOpen(true)}
        columns={[
          {
            header: 'Nombre del Impuesto',
            accessorKey: 'name',
            cell: (row) => (
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
              </div>
            ),
          },
          {
            header: 'Porcentaje Aplicado',
            cell: (row) => (
              <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Percent className="h-3 w-3" />
                <span>{row.value}%</span>
              </span>
            ),
          },
          {
            header: 'Categoría Fiscal',
            cell: (row) => (
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {row.category?.name || 'Standard Tax'}
              </span>
            ),
          },
          {
            header: 'Zona Geográfica',
            cell: (row) => (
              <span className="text-xs text-zinc-500">
                {row.zone?.name || 'Americas / Global'}
              </span>
            ),
          },
          {
            header: 'Estado',
            cell: (row) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaxRate(row.id, row.enabled);
                }}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition hover:scale-105 cursor-pointer ${
                  row.enabled
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                }`}
                title="Haz clic para activar o desactivar este impuesto"
              >
                {row.enabled ? '✓ Habilitado' : '✗ Deshabilitado'}
              </button>
            ),
          },
        ]}
      />

      {/* Modal Crear Tasa de Impuesto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nueva Tasa Impositiva</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ajusta el gravamen para ventas locales o internacionales
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateTaxRate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nombre del Gravamen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ITBIS República Dominicana (18%), IVA 16%"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-emerald-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Porcentaje (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="18"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-emerald-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Guardar Tasa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
