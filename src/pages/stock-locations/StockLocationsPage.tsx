import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Warehouse, Plus, X, AlertCircle, Loader2, MapPin } from 'lucide-react';

interface StockLocation {
  id: string;
  name: string;
  description?: string;
}

export const StockLocationsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la ubicación.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateStockLocation($input: CreateStockLocationInput!) {
          createStockLocation(input: $input) {
            id
            name
            description
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      });

      setIsModalOpen(false);
      setName('');
      setDescription('');
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la ubicación de stock.');
    } finally {
      setIsLoading(false);
    }
  };

  const query = `
    query GetStockLocations {
      stockLocations(options: { take: 50 }) {
        items {
          id
          name
          description
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView<StockLocation>
        title="Ubicaciones de Inventario & Almacenes"
        subtitle="Administra depósitos físicos, tiendas físicas y almacenes de despacho para distribución multicanal de stock"
        icon={Warehouse}
        query={query}
        queryResultKey="stockLocations"
        actionButtonText="Nuevo Almacén"
        onActionButtonClick={() => setIsModalOpen(true)}
        columns={[
          {
            header: 'Nombre del Almacén',
            accessorKey: 'name',
            cell: (row) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Warehouse className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
                </div>
              </div>
            ),
          },
          {
            header: 'Descripción / Dirección',
            accessorKey: 'description',
            cell: (row) => (
              <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                <span>{row.description || 'Almacén general de operaciones'}</span>
              </span>
            ),
          },
        ]}
      />

      {/* Modal Crear Ubicación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Warehouse className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nuevo Almacén o Depósito</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Añade un punto físico de existencias
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

            <form onSubmit={handleCreateLocation} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nombre de la Ubicación / Tienda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Almacén Central Santo Domingo, Bodega Norte Santiago"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-amber-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Descripción o Dirección Física
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Av. Winston Churchill, Plaza Central Local #4B. Tel: 809-555-0199"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-hidden focus:border-amber-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
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
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/30 hover:bg-amber-500 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Registrar Almacén</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
