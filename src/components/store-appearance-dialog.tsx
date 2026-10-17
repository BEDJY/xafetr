import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { Input } from '@/vdb/components/ui/input.js';
import { toast } from '@/vdb/components/ui/sonner.js';
import { Check, Eye, Moon, Paintbrush, Palette, Sparkles, Store, Sun } from 'lucide-react';
import * as React from 'react';

export interface StoreAppearanceSettings {
    displayName: string;
    tagline: string;
    brandColor: string;
    themeMode: 'dark' | 'light' | 'auto';
    accentGradient: string;
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

export function getStoreAppearance(channelId: string, defaultCode: string): StoreAppearanceSettings {
    const defaultName = defaultCode === '__default_channel__' ? 'Tienda Principal' : defaultCode;
    const defaultSettings: StoreAppearanceSettings = {
        displayName: defaultName,
        tagline: 'Tienda oficial de productos y servicios',
        brandColor: '#0ea5e9',
        themeMode: 'dark',
        accentGradient: 'from-sky-500 to-blue-600',
    };

    try {
        const stored = localStorage.getItem(`store_appearance_${channelId}`);
        if (stored) {
            return { ...defaultSettings, ...JSON.parse(stored) };
        }
    } catch {
        // fallback
    }
    return defaultSettings;
}

export function saveStoreAppearance(channelId: string, settings: StoreAppearanceSettings) {
    try {
        localStorage.setItem(`store_appearance_${channelId}`, JSON.stringify(settings));
        window.dispatchEvent(
            new CustomEvent('store-appearance-changed', {
                detail: { channelId, settings },
            }),
        );
    } catch (e) {
        console.error('Failed to save store appearance', e);
    }
}

interface StoreAppearanceDialogProps {
    channel: { id: string; code: string; token?: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: (settings: StoreAppearanceSettings) => void;
}

export function StoreAppearanceDialog({
    channel,
    open,
    onOpenChange,
    onSaved,
}: StoreAppearanceDialogProps) {
    if (!channel) return null;

    const initialSettings = React.useMemo(
        () => getStoreAppearance(channel.id, channel.code),
        [channel.id, channel.code],
    );

    const [displayName, setDisplayName] = React.useState(initialSettings.displayName);
    const [tagline, setTagline] = React.useState(initialSettings.tagline);
    const [brandColor, setBrandColor] = React.useState(initialSettings.brandColor);
    const [themeMode, setThemeMode] = React.useState<'dark' | 'light' | 'auto'>(initialSettings.themeMode);
    const [accentGradient, setAccentGradient] = React.useState(initialSettings.accentGradient);

    React.useEffect(() => {
        const s = getStoreAppearance(channel.id, channel.code);
        setDisplayName(s.displayName);
        setTagline(s.tagline);
        setBrandColor(s.brandColor);
        setThemeMode(s.themeMode);
        setAccentGradient(s.accentGradient);
    }, [channel.id, channel.code, open]);

    const handleColorSelect = (hex: string, gradient: string) => {
        setBrandColor(hex);
        setAccentGradient(gradient);
    };

    const handleSave = () => {
        const newSettings: StoreAppearanceSettings = {
            displayName: displayName.trim() || channel.code,
            tagline: tagline.trim(),
            brandColor,
            themeMode,
            accentGradient,
        };
        saveStoreAppearance(channel.id, newSettings);
        toast.success(`¡Apariencia de "${newSettings.displayName}" actualizada con éxito!`);
        if (onSaved) onSaved(newSettings);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-2xl border border-white/20 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl text-slate-100 shadow-2xl">
                <DialogHeader className="pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md transition-all"
                            style={{ backgroundColor: brandColor }}
                        >
                            <Palette className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <span>Editar UI y Apariencia</span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-sky-300 font-mono">
                                    {channel.code}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-400 mt-0.5">
                                Personaliza la identidad visual, colores y temas de esta tienda.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-5 py-3">
                    {/* Live Preview Card */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-sky-400" />
                            Vista Previa de la Tienda
                        </label>
                        <div
                            className={`p-4 rounded-xl border border-white/15 transition-all shadow-md overflow-hidden relative ${
                                themeMode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-white'
                            }`}
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                                style={{ backgroundColor: brandColor }}
                            />
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-sm transition-all text-sm"
                                        style={{ backgroundColor: brandColor }}
                                    >
                                        <Store className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm tracking-tight">
                                            {displayName || 'Nombre de la tienda'}
                                        </h4>
                                        <p className="text-[11px] opacity-70">
                                            {tagline || 'Eslogan comercial de la tienda'}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white shadow-xs"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    Tienda Activa
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Display Name & Tagline */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300">
                                Nombre comercial visible
                            </label>
                            <Input
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="Ej. Dobeha Mascotas Pro"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-sky-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300">
                                Eslogan o subtítulo
                            </label>
                            <Input
                                value={tagline}
                                onChange={e => setTagline(e.target.value)}
                                placeholder="Ej. Especialistas en nutrición y accesorios"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-sky-400"
                            />
                        </div>
                    </div>

                    {/* Brand Color Presets */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Paintbrush className="h-3.5 w-3.5 text-sky-400" />
                            Color de Identidad / Marca
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                            {COLOR_PRESETS.map(preset => {
                                const isSelected = brandColor === preset.hex;
                                return (
                                    <button
                                        key={preset.hex}
                                        type="button"
                                        onClick={() => handleColorSelect(preset.hex, preset.gradient)}
                                        className={`group relative flex flex-col items-center justify-center h-12 rounded-xl transition-all ${
                                            isSelected
                                                ? 'ring-2 ring-white scale-105 shadow-md'
                                                : 'hover:scale-105 opacity-80 hover:opacity-100'
                                        }`}
                                        style={{ backgroundColor: preset.hex }}
                                        title={preset.name}
                                    >
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-white drop-shadow-md stroke-[3]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Theme Mode */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                            Modo Visual de la Interfaz
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setThemeMode('dark')}
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                    themeMode === 'dark'
                                        ? 'border-sky-400 bg-sky-500/15 text-white ring-1 ring-sky-400'
                                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                <Moon className="h-4 w-4 text-sky-400" />
                                <span>Modo Oscuro Glass</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setThemeMode('light')}
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                    themeMode === 'light'
                                        ? 'border-sky-400 bg-sky-500/15 text-white ring-1 ring-sky-400'
                                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                <Sun className="h-4 w-4 text-amber-400" />
                                <span>Modo Claro</span>
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="bg-transparent border-white/15 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md"
                        style={{ backgroundColor: brandColor }}
                    >
                        Guardar Apariencia
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
