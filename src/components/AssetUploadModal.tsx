import React, { useState, useRef } from 'react';
import { VendureClient } from '../services/vendureClient';
import {
  X,
  UploadCloud,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

interface AssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Create object URLs for previews
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newUrls]);
    setErrorMsg(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg('Por favor selecciona al menos un archivo para subir.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const results = await VendureClient.uploadAssets(selectedFiles);
      setSuccessMsg(`¡${results.length} archivo(s) subido(s) con éxito a Cloudflare R2 / S3!`);
      setSelectedFiles([]);
      setPreviews([]);
      onUploadSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Error al subir los archivos');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Subir Recursos Multimedia
            </h2>
            <p className="text-xs text-zinc-400">
              Sube imágenes u otros archivos que se sincronizarán directamente en Cloudflare R2 / S3.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center transition cursor-pointer hover:border-sky-500 hover:bg-sky-50/20 dark:border-zinc-700 dark:bg-zinc-850 dark:hover:border-sky-400"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Arrastra y suelta tus archivos aquí, o haz clic para explorar
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Formatos admitidos: PNG, JPG, WEBP, GIF, SVG (hasta 20MB cada uno)
          </p>
        </div>

        {/* Selected Files Preview List */}
        {selectedFiles.length > 0 && (
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Archivos Seleccionados ({selectedFiles.length})
            </h4>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-2 text-xs dark:border-zinc-800 dark:bg-zinc-800/40"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {previews[idx] ? (
                      <img
                        src={previews[idx]}
                        alt={file.name}
                        className="h-9 w-9 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                        <FileImage className="h-4 w-4 text-zinc-500" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    disabled={isUploading}
                    className="p-1.5 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Subiendo a R2 / S3...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                <span>Subir {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
