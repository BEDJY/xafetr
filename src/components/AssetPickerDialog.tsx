import React, { useState, useEffect, useRef } from 'react';
import { VendureClient } from '../services/vendureClient';
import {
  X,
  Search,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Loader2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

interface AssetPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (url: string, asset?: any) => void;
  currentImageUrl?: string;
}

export const AssetPickerDialog: React.FC<AssetPickerDialogProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  currentImageUrl,
}) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTab, setUploadTab] = useState<'gallery' | 'upload'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await VendureClient.request<{ assets: { items: any[]; totalItems: number } }>(`
        query GetAssetsForPicker {
          assets(options: { take: 50, sort: { createdAt: DESC } }) {
            items {
              id
              name
              preview
              source
              fileSize
              mimeType
              width
              height
            }
            totalItems
          }
        }
      `);
      if (res?.assets?.items) {
        setAssets(res.assets.items);
      }
    } catch (err) {
      console.warn('Error fetching assets for picker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setSelectedAsset(null);
      setUploadTab('gallery');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = await VendureClient.uploadAssets(Array.from(files));
      await fetchAssets();
      if (uploaded && uploaded.length > 0) {
        setSelectedAsset(uploaded[0]);
        setUploadTab('gallery');
      }
    } catch (err) {
      console.error('Error uploading asset:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (!search.trim()) return true;
    return a.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleConfirmSelection = () => {
    if (!selectedAsset) return;
    const url = selectedAsset.preview || selectedAsset.source;
    onSelectAsset(url, selectedAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Biblioteca Multimedia (Cloudflare R2)
              </h3>
              <p className="text-[11px] text-zinc-500">
                Selecciona una imagen existente o sube un nuevo archivo optimizado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAssets}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Refrescar catálogo"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-50/70 dark:bg-zinc-950/40 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-1 rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadTab('gallery')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                uploadTab === 'gallery'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Galería ({assets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadTab('upload')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                uploadTab === 'upload'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Subir Imagen</span>
            </button>
          </div>

          {uploadTab === 'gallery' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {uploadTab === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center hover:border-sky-500 hover:bg-sky-50/10 transition cursor-pointer dark:border-zinc-700 dark:bg-zinc-900/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 mb-3">
                {isUploading ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <UploadCloud className="h-7 w-7" />
                )}
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {isUploading ? 'Subiendo a Cloudflare R2...' : 'Haz clic o arrastra imágenes aquí'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Formatos recomendados: JPG, PNG, WEBP, AVIF (hasta 15MB)
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-24 text-xs text-zinc-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
              <span>Cargando biblioteca multimedia...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-xs text-zinc-400">
              <ImageIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="font-semibold text-zinc-600 dark:text-zinc-300">
                No se encontraron imágenes
              </p>
              <p className="mt-1">
                Sube tu primera imagen usando la pestaña &quot;Subir Imagen&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id || currentImageUrl === asset.preview;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl border overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-md'
                        : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                      <img
                        src={asset.preview || asset.source}
                        alt={asset.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-white dark:bg-zinc-900 text-left">
                      <p className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {asset.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {asset.width && asset.height ? `${asset.width}×${asset.height}px` : 'Imagen'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 border-t border-zinc-200/80 dark:bg-zinc-950/50 dark:border-zinc-800">
          <div className="text-xs text-zinc-500">
            {selectedAsset ? (
              <span className="truncate max-w-[250px] inline-block">
                Seleccionado: <strong className="text-zinc-800 dark:text-zinc-200">{selectedAsset.name}</strong>
              </span>
            ) : (
              <span>Selecciona una imagen de la lista</span>
            )}
          </div>

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
              disabled={!selectedAsset}
              onClick={handleConfirmSelection}
              className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Usar Imagen Seleccionada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
