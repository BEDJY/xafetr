import React, { useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import { X, FolderPlus, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionCreated: () => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCollectionCreated,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor introduce el nombre de la colección.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const mutation = `
        mutation CreateCollection($input: CreateCollectionInput!) {
          createCollection(input: $input) {
            id
            name
            slug
            isPrivate
          }
        }
      `;

      const input = {
        translations: [
          {
            languageCode: 'es',
            name: name.trim(),
            slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
            description: description.trim(),
          },
        ],
        isPrivate,
        filters: [],
      };

      const res = await VendureClient.request(mutation, { input });
      if (res?.createCollection?.id) {
        setSuccessMsg(`¡Colección "${name}" creada exitosamente!`);
        setName('');
        setSlug('');
        setDescription('');
        setIsPrivate(false);
        onCollectionCreated();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      } else {
        throw new Error('No se pudo crear la colección');
      }
    } catch (err: any) {
      console.error('Error creating collection:', err);
      setErrorMsg(err.message || 'Error al guardar la colección');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Nueva Colección de Productos
              </h2>
              <p className="text-xs text-zinc-400">
                Agrupa productos por categorías, temporadas u ofertas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nombre de la Colección *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Calzado Deportivo, Hogar & Decoración"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Slug URL *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                /
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="calzado-deportivo"
                className="w-full font-mono rounded-xl border border-zinc-200 bg-white py-2 pl-7 pr-3.5 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Identificador único para enlaces y navegación en la tienda.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumen de los productos incluidos en esta categoría..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">Colección Privada</p>
              <p className="text-[11px] text-zinc-400">Ocultar de la navegación pública de la tienda</p>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Crear Colección</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
