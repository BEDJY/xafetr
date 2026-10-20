import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Users2, Plus, X, AlertCircle, Loader2, UserCheck } from 'lucide-react';

interface CustomerGroup {
  id: string;
  name: string;
  customers?: {
    totalItems?: number;
    items?: Array<{ id: string; firstName: string; lastName: string; emailAddress: string }>;
  };
}

export const CustomerGroupsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre del grupo.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
          createCustomerGroup(input: $input) {
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
      setErrorMsg(err.message || 'Error al crear el grupo de clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  const query = `
    query GetCustomerGroups {
      customerGroups(options: { take: 50 }) {
        items {
          id
          name
          customers {
            totalItems
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView<CustomerGroup>
        title="Grupos de Clientes & Segmentación"
        subtitle="Organiza a tus clientes en segmentos: Clientes VIP, Mayoristas B2B, Distribuidores o Frecuentes para aplicar promociones personalizadas"
        icon={Users2}
        query={query}
        queryResultKey="customerGroups"
        actionButtonText="Nuevo Grupo"
        onActionButtonClick={() => setIsModalOpen(true)}
        columns={[
          {
            header: 'Nombre del Grupo',
            accessorKey: 'name',
            cell: (row) => (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
              </div>
            ),
          },
          {
            header: 'Clientes Asignados',
            cell: (row) => (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-500 border border-sky-500/20">
                <UserCheck className="h-3 w-3" />
                <span>{row.customers?.totalItems || 0} miembros</span>
              </span>
            ),
          },
        ]}
        mockFallback={[
          {
            id: 'cg-1',
            name: 'Clientes VIP Gold',
            customers: { totalItems: 24 },
          },
          {
            id: 'cg-2',
            name: 'Mayoristas B2B / Distribuidores',
            customers: { totalItems: 12 },
          },
        ]}
      />

      {/* Modal Crear Grupo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Users2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nuevo Grupo de Clientes</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Segmenta a tus compradores para tarifas especiales
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

            <form onSubmit={handleCreateGroup} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nombre del Segmento / Grupo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Clientes VIP, Mayoristas B2B, Programa Fidelidad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
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
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/30 hover:bg-sky-500 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Crear Grupo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
