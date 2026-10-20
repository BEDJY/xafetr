import React, { useEffect, useState } from 'react';
import {
  Layers,
  Search,
  RefreshCw,
  Edit2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Sparkles,
  Download,
  CheckSquare,
  Square,
  TrendingUp,
  Boxes,
  X,
} from 'lucide-react';
import { ProductService, type FullProductVariant } from '../../services/productService';
import { useChannel } from '../../context/ChannelContext';
import { VariantGeneratorModal } from '../../components/VariantGeneratorModal';

export const ProductVariantsPage: React.FC = () => {
  const { activeChannel } = useChannel();
  const [variants, setVariants] = useState<FullProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'instock' | 'outofstock' | 'flash'>('all');

  // Generador de matriz de variantes
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Selección en lote (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPriceChangeType, setBulkPriceChangeType] = useState<'percent_increase' | 'percent_decrease' | 'fixed'>('percent_increase');
  const [bulkPriceValue, setBulkPriceValue] = useState('10');

  const [isBulkStockModalOpen, setIsBulkStockModalOpen] = useState(false);
  const [bulkStockChangeType, setBulkStockChangeType] = useState<'add' | 'set'>('add');
  const [bulkStockValue, setBulkStockValue] = useState('20');

  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Modal de edición individual de variante
  const [editingVariant, setEditingVariant] = useState<FullProductVariant | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editFlashActive, setEditFlashActive] = useState(false);
  const [editFlashDiscount, setEditFlashDiscount] = useState(15);
  const [editPriceBefore, setEditPriceBefore] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchVariants = async () => {
    setIsLoading(true);
    try {
      const res = await ProductService.getProductVariants(200, 0);
      setVariants(res.items);
      setSelectedIds([]);
    } catch (err) {
      console.warn('Error al cargar variantes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [activeChannel]);

  // Manejo de selecciones
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVariants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVariants.map((v) => v.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Edición individual
  const openEditModal = (v: FullProductVariant) => {
    setEditingVariant(v);
    setEditPrice((v.price / 100).toFixed(2));
    setEditStock(String(v.stockOnHand ?? 0));
    setEditSku(v.sku || '');
    setEditFlashActive(Boolean(v.customFields?.enOfertaFlash));
    setEditFlashDiscount(v.customFields?.porcentajeDescuento || 15);
    setEditPriceBefore(
      v.customFields?.precioAnterior ? (v.customFields.precioAnterior / 100).toFixed(2) : ''
    );
  };

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    setIsSaving(true);
    try {
      const priceNum = parseFloat(editPrice) || 0;
      const stockNum = parseInt(editStock, 10) || 0;
      const priceBeforeVal = parseFloat(editPriceBefore);
      const priceBeforeCents = isNaN(priceBeforeVal) ? undefined : Math.round(priceBeforeVal * 100);

      await ProductService.updateVariant({
        id: editingVariant.id,
        price: priceNum,
        stockOnHand: stockNum,
        sku: editSku.trim(),
        enOfertaFlash: editFlashActive,
        porcentajeDescuento: editFlashActive ? editFlashDiscount : 0,
        precioAnterior: editFlashActive ? priceBeforeCents : undefined,
      });

      setEditingVariant(null);
      await fetchVariants();
    } catch (err) {
      alert('Error al actualizar variante: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Acciones en Lote: Precios masivos
  const handleApplyBulkPrice = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);

    try {
      const targetVariants = variants.filter((v) => selectedIds.includes(v.id));
      const valNum = parseFloat(bulkPriceValue) || 0;

      for (const v of targetVariants) {
        let newPrice = v.price / 100;
        if (bulkPriceChangeType === 'percent_increase') {
          newPrice = newPrice * (1 + valNum / 100);
        } else if (bulkPriceChangeType === 'percent_decrease') {
          newPrice = Math.max(0, newPrice * (1 - valNum / 100));
        } else {
          newPrice = valNum;
        }

        await ProductService.updateVariant({
          id: v.id,
          price: Math.round(newPrice * 100) / 100,
          stockOnHand: v.stockOnHand,
          sku: v.sku,
        });
      }

      setIsBulkPriceModalOpen(false);
      await fetchVariants();
    } catch (err: any) {
      alert('Error en actualización masiva de precios: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Acciones en Lote: Stock masivo
  const handleApplyBulkStock = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);

    try {
      const targetVariants = variants.filter((v) => selectedIds.includes(v.id));
      const valNum = parseInt(bulkStockValue, 10) || 0;

      for (const v of targetVariants) {
        let newStock = v.stockOnHand ?? 0;
        if (bulkStockChangeType === 'add') {
          newStock = Math.max(0, newStock + valNum);
        } else {
          newStock = Math.max(0, valNum);
        }

        await ProductService.updateVariant({
          id: v.id,
          price: v.price / 100,
          stockOnHand: newStock,
          sku: v.sku,
        });
      }

      setIsBulkStockModalOpen(false);
      await fetchVariants();
    } catch (err: any) {
      alert('Error en ajuste masivo de stock: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Acciones en Lote: Oferta Flash masiva
  const handleBulkToggleFlash = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);

    try {
      const targetVariants = variants.filter((v) => selectedIds.includes(v.id));
      const firstActive = Boolean(targetVariants[0]?.customFields?.enOfertaFlash);
      const nextActive = !firstActive;

      for (const v of targetVariants) {
        const currPrice = v.price / 100;
        const compareAt = nextActive ? Math.round(currPrice * 1.25 * 100) : undefined;

        await ProductService.updateVariant({
          id: v.id,
          price: currPrice,
          stockOnHand: v.stockOnHand,
          sku: v.sku,
          enOfertaFlash: nextActive,
          porcentajeDescuento: nextActive ? 20 : 0,
          precioAnterior: compareAt,
        });
      }

      await fetchVariants();
    } catch (err: any) {
      alert('Error al alternar oferta flash masiva: ' + err.message);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Exportar Selección a CSV
  const handleExportSelectedCSV = () => {
    const targetVariants =
      selectedIds.length > 0 ? variants.filter((v) => selectedIds.includes(v.id)) : filteredVariants;

    if (targetVariants.length === 0) return;

    const headers = ['ID', 'Producto', 'Variante', 'SKU', 'Precio', 'Stock', 'OfertaFlash', 'Descuento%'];
    const rows = targetVariants.map((v) => [
      `"${v.id}"`,
      `"${v.product?.name || ''}"`,
      `"${v.name}"`,
      `"${v.sku}"`,
      `"${(v.price / 100).toFixed(2)}"`,
      `"${v.stockOnHand ?? 0}"`,
      `"${v.customFields?.enOfertaFlash ? 'SI' : 'NO'}"`,
      `"${v.customFields?.porcentajeDescuento || 0}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `variantes_inventario_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtros
  const filteredVariants = variants.filter((v) => {
    const term = search.toLowerCase();
    const matchesName = v.name.toLowerCase().includes(term);
    const matchesSku = v.sku.toLowerCase().includes(term);
    const matchesProduct = v.product?.name.toLowerCase().includes(term) ?? false;
    const matchesSearch = matchesName || matchesSku || matchesProduct;

    if (!matchesSearch) return false;

    if (filterMode === 'instock') return (v.stockOnHand ?? 0) > 0;
    if (filterMode === 'outofstock') return (v.stockOnHand ?? 0) <= 0;
    if (filterMode === 'flash') return Boolean(v.customFields?.enOfertaFlash);

    return true;
  });

  const inStockCount = variants.filter((v) => (v.stockOnHand ?? 0) > 0).length;
  const outOfStockCount = variants.filter((v) => (v.stockOnHand ?? 0) <= 0).length;
  const flashSaleCount = variants.filter((v) => Boolean(v.customFields?.enOfertaFlash)).length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              Variantes de Producto & Inventario
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Control granular de SKUs, existencias en almacén, precios diferenciados y ofertas flash por variante
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportSelectedCSV}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
            title="Exportar a CSV / Excel"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generar Variantes (Matrix)</span>
          </button>

          <button
            onClick={fetchVariants}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 disabled:opacity-50 cursor-pointer"
            title="Recargar inventario"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'all'
              ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10'
              : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Variantes</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{variants.length}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('instock')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'instock'
              ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">En Existencia</p>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
            <span>{inStockCount}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('outofstock')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'outofstock'
              ? 'border-rose-500 bg-rose-500/5 dark:bg-rose-500/10'
              : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Agotadas</p>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-rose-500">
            <XCircle className="h-5 w-5" />
            <span>{outOfStockCount}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('flash')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'flash'
              ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10'
              : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">En Oferta Flash</p>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-amber-500">
            <Zap className="h-5 w-5" />
            <span>{flashSaleCount}</span>
          </div>
        </button>
      </div>

      {/* Buscador & Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de variante, SKU o producto principal..."
            className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {filterMode !== 'all' && (
            <button
              onClick={() => setFilterMode('all')}
              className="text-xs text-sky-500 font-bold hover:underline cursor-pointer"
            >
              Limpiar filtro ({filterMode})
            </button>
          )}
          <span className="text-xs font-semibold text-zinc-500">
            Mostrando: <strong className="text-zinc-900 dark:text-white">{filteredVariants.length}</strong>
          </span>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-indigo-500/30 bg-zinc-950/90 text-white shadow-xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">variantes seleccionadas</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBulkPriceModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold cursor-pointer transition"
            >
              <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
              <span>Ajustar Precios</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkStockModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold cursor-pointer transition"
            >
              <Boxes className="h-3.5 w-3.5 text-emerald-400" />
              <span>Ajustar Stock</span>
            </button>

            <button
              type="button"
              onClick={handleBulkToggleFlash}
              disabled={isBulkProcessing}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 text-xs font-bold cursor-pointer transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Alternar Oferta Flash</span>
            </button>

            <button
              type="button"
              onClick={handleExportSelectedCSV}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold cursor-pointer transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
              title="Deseleccionar todo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Variantes */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredVariants.length ? (
                      <CheckSquare className="h-4 w-4 text-indigo-500" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Variante / Opciones</th>
                <th className="px-4 py-3">Producto Principal</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Promoción Flash</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredVariants.length > 0 ? (
                filteredVariants.map((v) => {
                  const isSelected = selectedIds.includes(v.id);
                  const isFlash = Boolean(v.customFields?.enOfertaFlash);
                  const priceFormatted = (v.price / 100).toFixed(2);
                  const priceBeforeFormatted = v.customFields?.precioAnterior
                    ? (v.customFields.precioAnterior / 100).toFixed(2)
                    : null;

                  return (
                    <tr
                      key={v.id}
                      className={`transition ${
                        isSelected
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/20'
                          : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(v.id)}
                          className="flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-indigo-500" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-sky-500 shrink-0" />
                          <span>{v.name}</span>
                        </div>
                        {v.options && v.options.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {v.options.map((opt) => (
                              <span
                                key={opt.id}
                                className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                {opt.group?.name}: <strong>{opt.name}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {v.product?.name || '—'}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">
                        {v.sku}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            (v.stockOnHand ?? 0) > 10
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : (v.stockOnHand ?? 0) > 0
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {(v.stockOnHand ?? 0) > 10 ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (v.stockOnHand ?? 0) > 0 ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{v.stockOnHand ?? 0} uds</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>${priceFormatted}</span>
                          {priceBeforeFormatted && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              ${priceBeforeFormatted}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {isFlash ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                            <Zap className="h-3 w-3 fill-amber-500" />
                            <span>-{v.customFields?.porcentajeDescuento || 15}% Flash</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400">Precio Regular</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditModal(v)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-sky-500" />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-zinc-400">
                    No se encontraron variantes con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Generador de Variantes */}
      <VariantGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onSuccess={() => fetchVariants()}
      />

      {/* Modal Ajuste Masivo de Precios */}
      {isBulkPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <h3 className="text-base font-bold">Ajuste Masivo de Precios</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Afectará a <strong>{selectedIds.length} variantes</strong> seleccionadas.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                  Tipo de Ajuste
                </label>
                <select
                  value={bulkPriceChangeType}
                  onChange={(e: any) => setBulkPriceChangeType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-xs"
                >
                  <option value="percent_increase">Aumentar Precio en % (+)</option>
                  <option value="percent_decrease">Reducir Precio en % (-)</option>
                  <option value="fixed">Fijar Precio Específico ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                  Valor ({bulkPriceChangeType === 'fixed' ? '$' : '%'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bulkPriceValue}
                  onChange={(e) => setBulkPriceValue(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkPriceModalOpen(false)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyBulkPrice}
                disabled={isBulkProcessing}
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-500"
              >
                {isBulkProcessing ? 'Actualizando...' : 'Aplicar a Selección'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajuste Masivo de Stock */}
      {isBulkStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            <h3 className="text-base font-bold">Ajuste Masivo de Inventario</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Afectará a <strong>{selectedIds.length} variantes</strong> seleccionadas.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                  Acción de Inventario
                </label>
                <select
                  value={bulkStockChangeType}
                  onChange={(e: any) => setBulkStockChangeType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-xs"
                >
                  <option value="add">Sumar Existencias al Stock (+)</option>
                  <option value="set">Establecer Cantidad Fija</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                  Cantidad (Unidades)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bulkStockValue}
                  onChange={(e) => setBulkStockValue(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkStockModalOpen(false)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyBulkStock}
                disabled={isBulkProcessing}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
              >
                {isBulkProcessing ? 'Actualizando...' : 'Actualizar Inventario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición Individual de Variante */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Editar Variante: {editingVariant.name}
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Producto: {editingVariant.product?.name}
                </p>
              </div>
              <button
                onClick={() => setEditingVariant(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveVariant} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    SKU / Código *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Stock en Existencia (uds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Precio de Venta ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-bold"
                />
              </div>

              {/* Configuración de Oferta Flash */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 dark:bg-amber-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        Activar Oferta Flash
                      </span>
                      <p className="text-[10px] text-zinc-500">
                        Destaca esta variante con precio tachado y cuenta regresiva
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editFlashActive}
                    onChange={(e) => setEditFlashActive(e.target.checked)}
                    className="h-4 w-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {editFlashActive && (
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-amber-500/20 pt-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        Precio Anterior / Tachado ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 99.00"
                        value={editPriceBefore}
                        onChange={(e) => {
                          setEditPriceBefore(e.target.value);
                          const val = parseFloat(e.target.value);
                          const curr = parseFloat(editPrice) || 0;
                          if (val > curr && val > 0) {
                            setEditFlashDiscount(Math.round(((val - curr) / val) * 100));
                          }
                        }}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        % Descuento Automático
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={editFlashDiscount}
                        onChange={(e) => setEditFlashDiscount(parseInt(e.target.value, 10) || 15)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-bold text-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
