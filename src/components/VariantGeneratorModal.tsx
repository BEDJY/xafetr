import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ProductService, type VendureProduct } from '../services/productService';

interface VariantGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultProductId?: string;
}

interface OptionDimension {
  name: string; // ej: "Talla", "Color"
  values: string[]; // ej: ["S", "M", "L"]
  currentInput: string;
}

export const VariantGeneratorModal: React.FC<VariantGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultProductId,
}) => {
  const [products, setProducts] = useState<VendureProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProductId || '');
  const [basePrice, setBasePrice] = useState('29.99');
  const [baseStock, setBaseStock] = useState('25');
  const [skuPrefix, setSkuPrefix] = useState('PROD');

  const [dimensions, setDimensions] = useState<OptionDimension[]>([
    { name: 'Talla', values: ['S', 'M', 'L', 'XL'], currentInput: '' },
    { name: 'Color', values: ['Negro', 'Blanco', 'Azul'], currentInput: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (defaultProductId) {
      setSelectedProductId(defaultProductId);
    }
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getProducts(100, 0);
        setProducts(res.items);
        const targetId = defaultProductId || selectedProductId || (res.items[0]?.id ?? '');
        setSelectedProductId(targetId);
        const targetProd = res.items.find(p => p.id === targetId) || res.items[0];
        if (targetProd) {
          const cleanSku = targetProd.variants?.[0]?.sku || targetProd.slug.toUpperCase().slice(0, 6);
          setSkuPrefix(cleanSku);
        }
      } catch (err) {
        console.warn('Error fetching products for generator:', err);
      }
    };
    fetchProducts();
  }, [isOpen, defaultProductId]);

  if (!isOpen) return null;

  // Manejo de dimensiones de opciones
  const addValueToDimension = (dimIdx: number) => {
    const dim = dimensions[dimIdx];
    const val = dim.currentInput.trim();
    if (!val || dim.values.includes(val)) return;

    setDimensions((prev) =>
      prev.map((d, i) =>
        i === dimIdx
          ? { ...d, values: [...d.values, val], currentInput: '' }
          : d
      )
    );
  };

  const removeValueFromDimension = (dimIdx: number, valToRemove: string) => {
    setDimensions((prev) =>
      prev.map((d, i) =>
        i === dimIdx
          ? { ...d, values: d.values.filter((v) => v !== valToRemove) }
          : d
      )
    );
  };

  const addDimension = () => {
    setDimensions((prev) => [...prev, { name: 'Atributo', values: [], currentInput: '' }]);
  };

  const removeDimension = (idx: number) => {
    setDimensions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Calcular producto cartesiano de combinaciones
  const calculateCombinations = (): Array<{ name: string; sku: string; price: number; stock: number }> => {
    const validDimensions = dimensions.filter((d) => d.name.trim() && d.values.length > 0);
    if (validDimensions.length === 0) return [];

    let results: string[][] = [[]];
    for (const dim of validDimensions) {
      const nextResults: string[][] = [];
      for (const res of results) {
        for (const val of dim.values) {
          nextResults.push([...res, val]);
        }
      }
      results = nextResults;
    }

    const priceNum = parseFloat(basePrice) || 0;
    const stockNum = parseInt(baseStock, 10) || 0;

    return results.map((combo) => {
      const comboName = combo.join(' - ');
      const comboSlug = combo.map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, '')).join('-');
      return {
        name: comboName,
        sku: `${skuPrefix}-${comboSlug.toUpperCase()}`,
        price: priceNum,
        stock: stockNum,
      };
    });
  };

  const combinations = calculateCombinations();

  const handleGenerate = async () => {
    if (!selectedProductId) {
      setErrorMsg('Por favor selecciona el producto al cual asociar las variantes.');
      return;
    }
    if (combinations.length === 0) {
      setErrorMsg('Debes ingresar al menos una opción y un valor (ej: Talla: M).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const selectedProduct = products.find((p) => p.id === selectedProductId);
      const prodName = selectedProduct?.name || 'Producto';

      const input = combinations.map((c) => ({
        productId: selectedProductId,
        sku: c.sku,
        translations: [
          {
            languageCode: 'es',
            name: `${prodName} - ${c.name}`,
          },
        ],
        price: Math.round(c.price * 100),
        stockOnHand: c.stock,
      }));

      await ProductService.createProductVariants(input);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error generating variants:', err);
      setErrorMsg(err.message || 'Error al generar las variantes en Vendure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Generador Automático de Variantes (Matrix)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Genera combinaciones multidimensionales (Talla × Color × Material) en un solo clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="mt-5 space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Producto Seleccionado */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Producto Destino *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = products.find((prod) => prod.id === e.target.value);
                if (p) {
                  const s = p.variants?.[0]?.sku || p.slug.toUpperCase().slice(0, 6);
                  setSkuPrefix(s);
                }
              }}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-sky-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.variants?.length || 0} variantes actuales)
                </option>
              ))}
            </select>
          </div>

          {/* Opciones y Dimensiones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Atributos & Opciones
              </label>
              <button
                type="button"
                onClick={addDimension}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:text-sky-400 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir Otro Atributo</span>
              </button>
            </div>

            {dimensions.map((dim, dimIdx) => (
              <div
                key={dimIdx}
                className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Nombre (ej: Talla, Color, Material)"
                    value={dim.name}
                    onChange={(e) =>
                      setDimensions((prev) =>
                        prev.map((d, i) => (i === dimIdx ? { ...d, name: e.target.value } : d))
                      )
                    }
                    className="font-bold text-xs text-zinc-900 dark:text-white bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-1 focus:border-sky-500 outline-hidden w-48"
                  />
                  {dimensions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDimension(dimIdx)}
                      className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Values pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {dim.values.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20 text-xs font-semibold"
                    >
                      <span>{val}</span>
                      <button
                        type="button"
                        onClick={() => removeValueFromDimension(dimIdx, val)}
                        className="hover:text-rose-500 cursor-pointer text-[10px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add value input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Valor + Enter"
                      value={dim.currentInput}
                      onChange={(e) =>
                        setDimensions((prev) =>
                          prev.map((d, i) => (i === dimIdx ? { ...d, currentInput: e.target.value } : d))
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addValueToDimension(dimIdx);
                        }
                      }}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs text-zinc-900 dark:text-white outline-hidden w-28"
                    />
                    <button
                      type="button"
                      onClick={() => addValueToDimension(dimIdx)}
                      className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Parámetros Base */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Precio Base ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-hidden focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Stock Inicial (Uds)
              </label>
              <input
                type="number"
                min="0"
                value={baseStock}
                onChange={(e) => setBaseStock(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 outline-hidden focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Prefijo SKU
              </label>
              <input
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs font-mono text-zinc-900 outline-hidden focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Previsualización de combinaciones generadas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Combinaciones a Crear ({combinations.length})
              </span>
              <span className="text-xs text-emerald-500 font-bold">
                ✓ Matriz calculada automáticamente
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40">
              {combinations.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-400 text-[10px]">#{i + 1}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{c.name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">({c.sku})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-zinc-900 dark:text-white">${c.price.toFixed(2)}</span>
                    <span className="text-[11px] text-emerald-500 font-semibold">{c.stock} uds</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <p className="text-xs text-zinc-400">
            Se registrarán <strong>{combinations.length} variantes</strong> directamente en Vendure Core.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isSubmitting || combinations.length === 0}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generando matriz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Crear {combinations.length} Variantes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
