import { useState } from 'react';
import { Render, type Data } from '@puckeditor/core';
import { puckConfig, type StorePuckProps } from './puckConfig';
import {
  Monitor,
  Tablet,
  Smartphone,
  ShoppingBag,
  Search,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface StorefrontPreviewProps {
  data: Data<StorePuckProps>;
  storeName: string;
  tagline: string;
  brandColor: string;
  themeMode: string;
  storeUrl: string;
  phone?: string;
  email?: string;
}

export default function StorefrontPreview({
  data,
  storeName,
  tagline,
  brandColor,
  themeMode,
  storeUrl,
  phone = '+57 300 123 4567',
  email = 'contacto@tienda.com',
}: StorefrontPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm',
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Top Device Bar & Quick Info */}
      <div className="flex flex-wrap items-center justify-between w-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Dispositivo:
          </span>
          <div className="flex rounded-xl border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                device === 'desktop'
                  ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-700 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Escritorio</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                device === 'tablet'
                  ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-700 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                device === 'mobile'
                  ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-700 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Móvil</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {storeUrl}
          </span>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition"
          >
            <span>Abrir Tienda</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 mx-auto ${deviceWidths[device]} ${
          device !== 'desktop'
            ? 'p-2 sm:p-4 rounded-3xl bg-zinc-200 dark:bg-zinc-800 shadow-2xl border-4 border-zinc-300 dark:border-zinc-700'
            : ''
        }`}
      >
        <div className={`overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm ${
          themeMode === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
        }`}>
          {/* Storefront Mockup Header */}
          <header className="sticky top-0 z-30 border-b border-zinc-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
            <div className="flex items-center justify-between gap-4">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-black text-base shadow-sm shrink-0"
                  style={{ backgroundColor: brandColor || '#0ea5e9' }}
                >
                  {storeName ? storeName.charAt(0).toUpperCase() : 'T'}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight">
                    {storeName || 'Mi Tienda Online'}
                  </h2>
                  {tagline && (
                    <p className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation links (Desktop only) */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                <a href="#inicio" className="text-zinc-900 dark:text-white hover:text-sky-500">
                  Inicio
                </a>
                <a href="#catalogo" className="hover:text-sky-500">
                  Catálogo
                </a>
                <a href="#ofertas" className="hover:text-sky-500">
                  Ofertas
                </a>
                <a href="#contacto" className="hover:text-sky-500">
                  Contacto
                </a>
              </nav>

              {/* Search & Cart Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
                  <Search className="h-3.5 w-3.5" />
                  <span>Buscar productos...</span>
                </div>
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: brandColor || '#0ea5e9' }}
                  >
                    2
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Rendered Puck Content Canvas */}
          <main className="min-h-[500px] p-4 sm:p-6 space-y-6">
            <Render config={puckConfig} data={data} />
          </main>

          {/* Storefront Mockup Footer */}
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-6 sm:px-10 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs"
                    style={{ backgroundColor: brandColor || '#0ea5e9' }}
                  >
                    {storeName ? storeName.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">
                    {storeName || 'Mi Tienda Online'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {tagline || 'Tu tienda de confianza con compras seguras y despachos a todo el país.'}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  <span>WhatsApp: {phone}</span>
                </div>
                {email && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <Mail className="h-4 w-4 text-sky-500" />
                    <span>Email: {email}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                  Navegación
                </h4>
                <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <li><a href="#inicio" className="hover:underline">Inicio</a></li>
                  <li><a href="#catalogo" className="hover:underline">Catálogo Completo</a></li>
                  <li><a href="#ofertas" className="hover:underline">Ofertas de Temporada</a></li>
                  <li><a href="#pedidos" className="hover:underline">Rastrear mi Pedido</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                  Políticas y Soporte
                </h4>
                <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <li><a href="#envios" className="hover:underline">Políticas de Envío</a></li>
                  <li><a href="#garantia" className="hover:underline">Garantía y Devoluciones</a></li>
                  <li><a href="#privacidad" className="hover:underline">Términos y Condiciones</a></li>
                  <li><a href="#faq" className="hover:underline">Preguntas Frecuentes</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
                  Seguridad & Pagos
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  Transacciones protegidas con cifrado SSL de 256 bits.
                </p>
                <div className="flex flex-wrap gap-2 text-zinc-400 text-xs">
                  <span className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-2 py-1 font-mono text-[10px]">
                    💳 Tarjetas
                  </span>
                  <span className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-2 py-1 font-mono text-[10px]">
                    📦 Contra Entrega
                  </span>
                  <span className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-2 py-1 font-mono text-[10px]">
                    🏦 Transferencia
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
              <p>© {new Date().getFullYear()} {storeName || 'Mi Tienda'}. Todos los derechos reservados.</p>
              <p className="text-[11px]">Plataforma de Comercio Electrónico Multi-Tenant</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
