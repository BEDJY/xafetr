import React, { useState, useEffect } from 'react';
import { useChannel } from '../context/ChannelContext';
import { Store, Check, Sun, Moon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Sky Blue', hex: '#0ea5e9', gradient: 'from-sky-500 to-blue-600' },
  { name: 'Emerald', hex: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Violet', hex: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
  { name: 'Rose', hex: '#f43f5e', gradient: 'from-rose-500 to-pink-600' },
  { name: 'Amber', hex: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Cyan', hex: '#06b6d4', gradient: 'from-cyan-500 to-teal-500' },
  { name: 'Indigo', hex: '#6366f1', gradient: 'from-indigo-500 to-blue-700' },
];

export const StoreAppearanceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeChannel, updateChannelAppearance } = useChannel();
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#0ea5e9');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [accentGradient, setAccentGradient] = useState('from-sky-500 to-blue-600');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (activeChannel?.customFields) {
      setDisplayName(activeChannel.customFields.displayName || activeChannel.code || '');
      setTagline(activeChannel.customFields.tagline || 'Tienda oficial de productos y servicios');
      setBrandColor(activeChannel.customFields.brandColor || '#0ea5e9');
      setThemeMode((activeChannel.customFields.themeMode as any) || 'dark');
      setAccentGradient(activeChannel.customFields.accentGradient || 'from-sky-500 to-blue-600');
    }
  }, [activeChannel]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg(false);
    try {
      await updateChannelAppearance({
        displayName,
        tagline,
        brandColor,
        themeMode,
        accentGradient,
      });
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('Error al guardar la apariencia en el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-700 bg-neutral-900 p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-sky-400" />
            <div>
              <h2 className="text-lg font-bold">Identidad de la Tienda</h2>
              <p className="text-xs text-neutral-400">Canal: {activeChannel?.code || 'Principal'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-300">
              Nombre Comercial
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ej: Tienda Central Dobeha"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-300">
              Eslogan / Descripción
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ej: Los mejores precios y calidad"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-neutral-300">
              Color de Marca
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = brandColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setBrandColor(preset.hex);
                      setAccentGradient(preset.gradient);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border p-2 text-xs transition-all ${
                      isSelected
                        ? 'border-white bg-neutral-800 font-bold text-white ring-2 ring-white/20'
                        : 'border-neutral-800 bg-neutral-800/50 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full shadow"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-neutral-300">
              Modo de Tema
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-2 text-xs transition ${
                  themeMode === 'dark'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-400 font-semibold'
                    : 'border-neutral-800 bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Moon className="h-4 w-4" /> Oscuro
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-2 text-xs transition ${
                  themeMode === 'light'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-400 font-semibold'
                    : 'border-neutral-800 bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="h-4 w-4" /> Claro
              </button>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500/20 py-2 text-xs font-semibold text-emerald-400">
            <Check className="h-4 w-4" /> ¡Identidad guardada en la base de datos!
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2 border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 disabled:opacity-50"
          >
            {isSaving ? 'Guardando en Servidor...' : 'Guardar Identidad'}
          </button>
        </div>
      </div>
    </div>
  );
};
