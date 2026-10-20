import React, { useState, useEffect } from 'react';
import { VendureClient } from '../services/vendureClient';
import {
  X,
  Tag,
  Check,
  Loader2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface AssignFacetValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  initialFacetValueIds?: string[];
  onSuccess: () => void;
}

interface FacetItem {
  id: string;
  name: string;
  code: string;
  values: Array<{
    id: string;
    name: string;
    code: string;
  }>;
}

export const AssignFacetValuesModal: React.FC<AssignFacetValuesModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  initialFacetValueIds = [],
  onSuccess,
}) => {
  const [facets, setFacets] = useState<FacetItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialFacetValueIds);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialFacetValueIds);
      setErrorMsg(null);
      fetchFacets();
    }
  }, [isOpen, initialFacetValueIds]);

  const fetchFacets = async () => {
    setLoading(true);
    try {
      const res = await VendureClient.request<{ facets: { items: FacetItem[] } }>(`
        query GetFacetsForAssignment {
          facets(options: { take: 50 }) {
            items {
              id
              name
              code
              values {
                id
                name
                code
              }
            }
          }
        }
      `);
      if (res?.facets?.items) {
        setFacets(res.facets.items);
      }
    } catch (err) {
      console.warn('Error fetching facets for modal:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !productId) return null;

  const toggleFacetValue = (valueId: string) => {
    setSelectedIds((prev) =>
      prev.includes(valueId) ? prev.filter((id) => id !== valueId) : [...prev, valueId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const mutation = `
        mutation UpdateProductFacets($input: UpdateProductInput!) {
          updateProduct(input: $input) {
            id
            facetValues {
              id
              name
              code
            }
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          id: productId,
          facetValueIds: selectedIds,
        },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating product facets:', err);
      setErrorMsg(err.message || 'Error al guardar las facetas en Vendure.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Asignar Facetas & Filtros
              </h3>
              <p className="text-[11px] text-zinc-500 truncate max-w-sm">
                Producto: <strong>{productName || 'Producto seleccionado'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-xs text-zinc-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              <span>Cargando facetas disponibles...</span>
            </div>
          ) : facets.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-400">
              No hay facetas creadas en la tienda todavía.
            </div>
          ) : (
            facets.map((facet) => (
              <div
                key={facet.id}
                className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    🏷️ {facet.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    #{facet.code}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {facet.values?.length === 0 ? (
                    <span className="text-[11px] text-zinc-400 italic">
                      Sin valores disponibles
                    </span>
                  ) : (
                    facet.values.map((val) => {
                      const isSelected = selectedIds.includes(val.id);
                      return (
                        <button
                          key={val.id}
                          type="button"
                          onClick={() => toggleFacetValue(val.id)}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-500/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 opacity-40" />
                          )}
                          <span>{val.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 border-t border-zinc-200/80 dark:bg-zinc-950/50 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">
            {selectedIds.length} faceta(s) seleccionada(s)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-600 disabled:opacity-50 transition flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Facetas</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
