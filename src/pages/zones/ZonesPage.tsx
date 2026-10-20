import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Globe2, Map, Plus, X, AlertCircle, Loader2 } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  members?: Array<{ id: string; name: string; code: string }>;
}

interface Country {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

export const ZonesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'zones' | 'countries'>('zones');
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleCountry = async (id: string, currentEnabled: boolean) => {
    try {
      await VendureClient.request(`
        mutation UpdateCountry($input: UpdateCountryInput!) {
          updateCountry(input: $input) {
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
      alert(err.message || 'Error al actualizar país');
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la zona.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateZone($input: CreateZoneInput!) {
          createZone(input: $input) {
            id
            name
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          name: newZoneName.trim(),
        },
      });

      setIsZoneModalOpen(false);
      setNewZoneName('');
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la zona.');
    } finally {
      setIsLoading(false);
    }
  };

  const zonesQuery = `
    query GetZones {
      zones(options: { take: 50 }) {
        items {
          id
          name
        }
      }
    }
  `;

  const countriesQuery = `
    query GetCountries {
      countries(options: { take: 100 }) {
        items {
          id
          name
          code
          enabled
        }
      }
    }
  `;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Tabs */}
      <div className="px-4 sm:px-8 pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'zones'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Map className="h-4 w-4" />
          <span>Zonas Geográficas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('countries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'countries'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Globe2 className="h-4 w-4" />
          <span>Países de Destino</span>
        </button>
      </div>

      {activeTab === 'zones' ? (
        <VendureDataView<Zone>
          title="Zonas Geográficas de Entrega & Facturación"
          subtitle="Agrupa países y regiones para aplicar tarifas de transporte e impuestos específicos"
          icon={Map}
          query={zonesQuery}
          queryResultKey="zones"
          actionButtonText="Nueva Zona"
          onActionButtonClick={() => setIsZoneModalOpen(true)}
          columns={[
            {
              header: 'Nombre de la Zona',
              accessorKey: 'name',
              cell: (row) => (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-sky-500" />
                  <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>
                </div>
              ),
            },
            {
              header: 'ID de Zona',
              accessorKey: 'id',
              cell: (row) => <span className="font-mono text-xs text-zinc-400">#{row.id}</span>,
            },
          ]}
        />
      ) : (
        <VendureDataView<Country>
          title="Catálogo de Países & Habilitación de Envíos"
          subtitle="Activa o desactiva qué naciones pueden seleccionar tus clientes al registrarse o en el checkout"
          icon={Globe2}
          query={countriesQuery}
          queryResultKey="countries"
          columns={[
            {
              header: 'País',
              accessorKey: 'name',
              cell: (row) => <span className="font-bold text-zinc-900 dark:text-white">{row.name}</span>,
            },
            {
              header: 'Código ISO',
              accessorKey: 'code',
              cell: (row) => (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {row.code}
                </span>
              ),
            },
            {
              header: 'Disponibilidad en Tienda',
              cell: (row) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCountry(row.id, row.enabled);
                  }}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition hover:scale-105 cursor-pointer ${
                    row.enabled
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                  }`}
                  title="Haz clic para activar o desactivar este país"
                >
                  {row.enabled ? '✓ Habilitado' : '✗ Deshabilitado'}
                </button>
              ),
            },
          ]}
        />
      )}

      {/* Modal Crear Zona */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Map className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nueva Zona Geográfica</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Crea un grupo territorial de entrega
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsZoneModalOpen(false)}
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

            <form onSubmit={handleCreateZone} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nombre de la Zona *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Caribe & Centroamérica, Zona Metropolitana SD"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
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
                  <span>Guardar Zona</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
