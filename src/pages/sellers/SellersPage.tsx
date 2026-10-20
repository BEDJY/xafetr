import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Plus, X, AlertCircle, Loader2, Building } from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  token?: string;
}

export const SellersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa la razón social o nombre del vendedor.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateSeller($input: CreateSellerInput!) {
          createSeller(input: $input) {
            id
            name
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          name: name.trim(),
        },
      });

      setIsModalOpen(false);
      setName('');
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar vendedor marketplace.');
    } finally {
      setIsLoading(false);
    }
  };

  const query = `
    query GetSellers {
      sellers(options: { take: 50 }) {
        items {
          id
          name
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView<Seller>
        title="Vendedores & Marcas (Multi-Vendor Marketplace)"
        subtitle="Gestiona comercios asociados, marcas aliadas y comerciantes que publican productos en la plataforma"
        icon={Building}
        query={query}
        queryResultKey="sellers"
        actionButtonText="Nuevo Vendedor"
        onActionButtonClick={() => setIsModalOpen(true)}
        columns={[
          {
            header: 'Razón Social / Nombre Comercial',
            accessorKey: 'name',
            cell: (row) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Building className="h-4 w-4" />
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
              </div>
            ),
          },
          {
            header: 'ID de Vendedor',
            accessorKey: 'id',
            cell: (row) => <span className="font-mono text-xs text-zinc-400">#{row.id}</span>,
          },
          {
            header: 'Estado',
            cell: () => (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Activo</span>
              </span>
            ),
          },
        ]}
      />

      {/* Modal Crear Vendedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Registrar Vendedor</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Añade un socio comercial o marca marketplace
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

            <form onSubmit={handleCreateSeller} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nombre Comercial / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Distribuidora Pet Supplies RD, Apple Store Autorizada"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
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
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Registrar Vendedor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
