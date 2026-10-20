import React, { useEffect, useState } from 'react';
import { Tag, Plus, Search, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { ProductService, type FacetItem } from '../../services/productService';
import { useChannel } from '../../context/ChannelContext';

export const FacetsPage: React.FC = () => {
  const { activeChannel } = useChannel();
  const [facets, setFacets] = useState<FacetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Modal para nueva faceta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFacetName, setNewFacetName] = useState('');
  const [newFacetCode, setNewFacetCode] = useState('');
  const [newFacetValuesStr, setNewFacetValuesStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal para añadir valor a faceta existente
  const [activeFacetForValue, setActiveFacetForValue] = useState<FacetItem | null>(null);
  const [newValueName, setNewValueName] = useState('');

  const fetchFacets = async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getFacets();
      setFacets(data);
    } catch (err) {
      console.warn('Error al cargar facetas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacets();
  }, [activeChannel]);

  const handleCreateFacet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacetName.trim()) return;

    setIsSubmitting(true);
    try {
      const initialValues = newFacetValuesStr
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      await ProductService.createFacet(
        newFacetName.trim(),
        newFacetCode.trim() || undefined,
        initialValues
      );

      setNewFacetName('');
      setNewFacetCode('');
      setNewFacetValuesStr('');
      setIsModalOpen(false);
      await fetchFacets();
    } catch (err) {
      alert('Error al crear faceta: ' + (err as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacetForValue || !newValueName.trim()) return;

    setIsSubmitting(true);
    try {
      await ProductService.addFacetValue(activeFacetForValue.id, newValueName.trim());
      setNewValueName('');
      setActiveFacetForValue(null);
      await fetchFacets();
    } catch (err) {
      alert('Error al añadir valor: ' + (err as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFacets = facets.filter((f) => {
    const term = search.toLowerCase();
    const matchesName = f.name.toLowerCase().includes(term);
    const matchesCode = f.code.toLowerCase().includes(term);
    const matchesValues = f.values.some((v) => v.name.toLowerCase().includes(term));
    return matchesName || matchesCode || matchesValues;
  });

  const totalValuesCount = facets.reduce((acc, f) => acc + (f.values?.length || 0), 0);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              Facetas & Filtros de Catálogo
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Estructura de filtrado multidimensional: marcas, atributos, especificaciones y categorías dinámicas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchFacets}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 disabled:opacity-50"
            title="Recargar facetas"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Faceta</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Rápidos */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Facetas</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{facets.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Valores de Filtro</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">{totalValuesCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Tienda Activa</p>
          <p className="mt-1 truncate text-base font-bold text-sky-500">
            {activeChannel?.customFields?.displayName || activeChannel?.code || 'Global'}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Indexación</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>Sincronizada</span>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de faceta, código o valor (ej: Nike, color, 16gb)..."
          className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        />
      </div>

      {/* Tarjetas de Facetas */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredFacets.map((facet) => (
          <div
            key={facet.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              {/* Encabezado de la Faceta */}
              <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white capitalize">
                      {facet.name}
                    </h3>
                    <span className="font-mono text-[11px] text-zinc-400">
                      código: <span className="text-zinc-600 dark:text-zinc-300">{facet.code}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      facet.isPrivate
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}
                  >
                    {facet.isPrivate ? 'Privada (Admin)' : 'Pública'}
                  </span>
                  <button
                    onClick={() => setActiveFacetForValue(facet)}
                    className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    title="Añadir nuevo valor"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Valor</span>
                  </button>
                </div>
              </div>

              {/* Valores de la Faceta */}
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Valores asignables ({facet.values?.length || 0}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {facet.values && facet.values.length > 0 ? (
                    facet.values.map((val) => (
                      <span
                        key={val.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-2xs dark:border-zinc-750 dark:bg-zinc-800/80 dark:text-zinc-200"
                      >
                        <span>{val.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400 opacity-70">
                          #{val.code}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400 italic">
                      Sin valores aún. Haz clic en "+ Valor" para agregar el primero.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800/80 text-[11px] text-zinc-400 flex justify-between items-center">
              <span>ID en Vendure: {facet.id}</span>
              <span className="text-zinc-500">Listo para filtros en tienda</span>
            </div>
          </div>
        ))}

        {filteredFacets.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-sm text-zinc-400">No se encontraron facetas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* Modal: Crear Nueva Faceta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Crear Nueva Faceta</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateFacet} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nombre de la Faceta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Material, Temporada, Género"
                  value={newFacetName}
                  onChange={(e) => setNewFacetName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Código (Opcional, slug automático)
                </label>
                <input
                  type="text"
                  placeholder="Ej: material, temporada"
                  value={newFacetCode}
                  onChange={(e) => setNewFacetCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Valores Iniciales (separados por coma)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Algodón, Seda, Cuero, Poliéster"
                  value={newFacetValuesStr}
                  onChange={(e) => setNewFacetValuesStr(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <p className="mt-1 text-[11px] text-zinc-400">
                  Cada valor ingresado se registrará automáticamente como valor de faceta elegible en el catálogo.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Faceta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Añadir Valor a Faceta */}
      {activeFacetForValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Añadir Valor a "{activeFacetForValue.name}"
              </h2>
              <button
                onClick={() => setActiveFacetForValue(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddValue} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nuevo Valor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Rojo Pasión, XL, Algodón Pima"
                  value={newValueName}
                  onChange={(e) => setNewValueName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveFacetForValue(null)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Añadiendo...' : 'Añadir Valor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
