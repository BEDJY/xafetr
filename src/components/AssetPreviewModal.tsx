import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface AssetPreviewModalProps {
  asset: any | null;
  onClose: () => void;
}

export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const handleCopyUrl = () => {
    const url = asset.source || asset.preview;
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-sky-500" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white truncate max-w-md">
              {asset.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Preview Box */}
        <div className="mt-4 flex max-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950 p-2">
          <img
            src={asset.source || asset.preview}
            alt={asset.name}
            className="max-h-[380px] w-auto max-w-full object-contain rounded-lg"
          />
        </div>

        {/* Meta details */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Dimensiones</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {asset.width && asset.height ? `${asset.width} × ${asset.height} px` : '—'}
            </span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tamaño</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {asset.fileSize ? `${(asset.fileSize / 1024).toFixed(1)} KB` : '—'}
            </span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tipo MIME</span>
            <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
              {asset.mimeType || 'image/jpeg'}
            </span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">ID Recurso</span>
            <span className="font-mono font-bold text-sky-500">#{asset.id}</span>
          </div>
        </div>

        {/* URL and copy action */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800/60">
          <input
            type="text"
            readOnly
            value={asset.source || asset.preview || ''}
            className="flex-1 bg-transparent px-2 text-xs font-mono text-zinc-600 dark:text-zinc-300 outline-none truncate"
          />
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
          </button>
          <a
            href={asset.source || asset.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
