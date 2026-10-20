import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  X,
  Coins,
} from 'lucide-react';
import { useChannel, type ChannelItem } from '../context/ChannelContext';
import { useAuth } from '../context/AuthContext';
import { VendureClient } from '../services/vendureClient';
import { DobehaLogo } from './common/DobehaLogo';

interface ChannelSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isLoginFlow?: boolean;
  onSelectChannel?: (channel: ChannelItem) => void;
}

export const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({
  isOpen,
  onClose,
  isLoginFlow = false,
  onSelectChannel,
}) => {
  const navigate = useNavigate();
  const { channels, activeChannel, setActiveChannel } = useChannel();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar canales a los que el usuario tiene acceso y construir lista unificada 100% confiable
  const accessibleChannels = useMemo(() => {
    if (!user) return channels;

    const isSuperAdmin = user.channels?.some((c) =>
      c.permissions?.includes('SuperAdmin')
    );

    // Mapear los canales que vienen de CHANNELS_QUERY por su token para acceso rápido
    const channelMap = new Map<string, ChannelItem>();
    channels.forEach((ch) => channelMap.set(ch.token, ch));

    // Si el usuario tiene canales asignados en CurrentUser:
    const combined: ChannelItem[] = [];

    if (user.channels && user.channels.length > 0) {
      for (const uc of user.channels) {
        const existing = channelMap.get(uc.token);
        if (existing) {
          combined.push(existing);
        } else {
          // Fallback inmediato con datos de CurrentUser para garantizar que siempre se muestren
          combined.push({
            id: uc.id,
            code: uc.code,
            token: uc.token,
            defaultCurrencyCode: 'USD',
            customFields: {
              displayName:
                uc.code === '__default_channel__'
                  ? 'Tienda Principal'
                  : uc.code.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
              tagline: 'Canal de ventas oficial',
              brandColor: uc.code === '__default_channel__' ? '#6366f1' : '#0ea5e9',
            },
          });
        }
      }
    }

    // Si es SuperAdmin, agregar cualquier otro canal disponible en channels que no esté en combined
    if (isSuperAdmin) {
      const existingTokens = new Set(combined.map((c) => c.token));
      for (const ch of channels) {
        if (!existingTokens.has(ch.token)) {
          combined.push(ch);
        }
      }
    }

    // Si combined aún está vacío pero channels tiene items, usar channels
    if (combined.length === 0 && channels.length > 0) {
      return channels;
    }

    return combined;
  }, [channels, user]);

  // Canales filtrados por la búsqueda
  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return accessibleChannels;
    const q = searchQuery.toLowerCase().trim();
    return accessibleChannels.filter((ch) => {
      const name = (ch.customFields?.displayName || ch.code).toLowerCase();
      const code = ch.code.toLowerCase();
      const token = ch.token.toLowerCase();
      const tagline = (ch.customFields?.tagline || '').toLowerCase();
      return name.includes(q) || code.includes(q) || token.includes(q) || tagline.includes(q);
    });
  }, [accessibleChannels, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (ch: ChannelItem) => {
    setActiveChannel(ch);
    VendureClient.setActiveChannelToken(ch.token);
    if (onSelectChannel) {
      onSelectChannel(ch);
    }
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  const handleCreateNewStore = () => {
    if (onClose) {
      onClose();
    }
    navigate('/create-store');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con desenfoque */}
      <div
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (!isLoginFlow && onClose) onClose();
        }}
      />

      {/* Contenedor del Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Glow decorativo superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 p-6 dark:border-zinc-800/80">
          <div className="flex items-center gap-3.5">
            <DobehaLogo size="md" iconOnly={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {isLoginFlow ? '¡Bienvenido a DOBEHA! Selecciona tu Tienda' : 'Tus Tiendas y Proyectos DOBEHA'}
                </h2>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                  {accessibleChannels.length} {accessibleChannels.length === 1 ? 'proyecto' : 'proyectos'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {user?.identifier ? (
                  <>
                    Proyectos creados para la cuenta: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user.identifier}</span>. Selecciona cuál deseas abrir:
                  </>
                ) : (
                  'Selecciona el proyecto que deseas gestionar o crea uno nuevo:'
                )}
              </p>
            </div>
          </div>

          {!isLoginFlow && onClose && (
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Barra de Búsqueda y Botón Rápido */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-850/40">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tienda por nombre, código o slug..."
              className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleCreateNewStore}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-sky-600 hover:to-indigo-700 transition cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Crear Nueva Tienda</span>
          </button>
        </div>

        {/* Lista de Canales / Tiendas */}
        <div className="max-h-80 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredChannels.length === 0 ? (
            <div className="py-10 text-center">
              <Store className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No tienes proyectos o tiendas creadas aún en esta cuenta
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {searchQuery ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer proyecto para comenzar a gestionar tu catálogo y tienda.'}
              </p>
              <button
                type="button"
                onClick={handleCreateNewStore}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 transition cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Crear mi primer Proyecto</span>
              </button>
            </div>
          ) : (
            filteredChannels.map((ch) => {
              const isSelected = activeChannel?.token === ch.token;
              const isDefault = ch.code === '__default_channel__';
              const displayName =
                ch.customFields?.displayName ||
                (isDefault
                  ? 'Tienda Principal (Default)'
                  : ch.code.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
              const tagline =
                ch.customFields?.tagline ||
                (isDefault
                  ? 'Canal raíz y catálogo central de la plataforma'
                  : 'Catálogo y tienda multi-tenant');
              const brandColor =
                ch.customFields?.brandColor || (isDefault ? '#6366f1' : '#0ea5e9');
              const currency = ch.defaultCurrencyCode || 'USD';

              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelect(ch)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(ch);
                    }
                  }}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 shadow-sm ring-1 ring-sky-500 dark:border-sky-500/80 dark:bg-sky-950/20'
                      : 'border-zinc-200/80 bg-white hover:border-sky-300 hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-850/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Badge con color corporativo de la tienda */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold text-base shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: brandColor }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-bold text-zinc-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400 transition-colors">
                          {displayName}
                        </h4>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Activa
                          </span>
                        )}
                      </div>

                      {tagline && (
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {tagline}
                        </p>
                      )}

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <span className="font-mono rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          slug: {ch.code}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Entrada */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-700 group-hover:bg-sky-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-sky-500 dark:group-hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Administrar' : 'Entrar'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-850/60">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Datos y catálogo aislados por cada tienda (Multi-Tenant).</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isLoginFlow && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Cerrar
              </button>
            )}

            <button
              type="button"
              onClick={handleCreateNewStore}
              className="flex items-center gap-1.5 rounded-xl border border-dashed border-sky-400 bg-sky-50/50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-950/60 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>+ Agregar Nueva Tienda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
