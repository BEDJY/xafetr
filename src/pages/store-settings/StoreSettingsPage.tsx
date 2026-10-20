import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChannel } from '../../context/ChannelContext';
import { useAI } from '../../context/AIContext';
import { VendureClient } from '../../services/vendureClient';
import PuckBuilder from '../../components/puck/PuckBuilder';
import StorefrontPreview from '../../components/puck/StorefrontPreview';
import { defaultStoreData, type StorePuckProps } from '../../components/puck/puckConfig';
import { type Data } from '@puckeditor/core';
import {
  Store,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Eye,
  MessageCircle,
  Share2,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="h-3.5 w-3.5 text-pink-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-3.5 w-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function StoreSettingsPage() {
  const { activeChannel } = useChannel();
  const { setIsOpen: setIsAIOpen } = useAI();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State with query param support
  const initialTab = (searchParams.get('tab') as 'builder' | 'branding' | 'contact' | 'preview') || 'builder';
  const [activeTab, setActiveTab] = useState<'builder' | 'branding' | 'contact' | 'preview'>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'builder' | 'branding' | 'contact' | 'preview';
    if (tabParam && ['builder', 'branding', 'contact', 'preview'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'builder' | 'branding' | 'contact' | 'preview') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Branding Fields (Synced with Vendure Backend)
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#0ea5e9');
  const [themeMode, setThemeMode] = useState('auto');

  // Contact & Social Fields
  const [phone, setPhone] = useState('+57 300 123 4567');
  const [whatsapp, setWhatsapp] = useState('+57 300 123 4567');
  const [email, setEmail] = useState('contacto@mitienda.com');
  const [instagram, setInstagram] = useState('@mitienda');
  const [facebook, setFacebook] = useState('mitiendafanpage');
  const [tiktok, setTiktok] = useState('@mitienda.oficial');
  const [welcomeMessage, setWelcomeMessage] = useState('¡Hola! Quiero información sobre los productos.');

  // Puck Page Builder State
  const [puckData, setPuckData] = useState<Data<StorePuckProps>>(defaultStoreData);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presetColors = [
    '#0ea5e9',
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#10b981',
    '#f59e0b',
    '#18181b',
  ];

  // Load Channel & LocalStorage configuration when activeChannel changes
  useEffect(() => {
    if (activeChannel) {
      setDisplayName(activeChannel.customFields?.displayName || activeChannel.code);
      setTagline(activeChannel.customFields?.tagline || '');
      setBrandColor(activeChannel.customFields?.brandColor || '#0ea5e9');
      setThemeMode(activeChannel.customFields?.themeMode || 'auto');

      // Load Puck layout from localStorage
      const savedPuck = localStorage.getItem(`puck_store_page_config_${activeChannel.id}`);
      if (savedPuck) {
        try {
          const parsed = JSON.parse(savedPuck);
          if (parsed && parsed.content && Array.isArray(parsed.content)) {
            setPuckData(parsed);
          }
        } catch (e) {
          console.warn('Could not parse stored puck layout, using default template.', e);
        }
      } else {
        setPuckData(defaultStoreData);
      }

      // Load Contact settings from localStorage
      const savedContact = localStorage.getItem(`store_contact_config_${activeChannel.id}`);
      if (savedContact) {
        try {
          const c = JSON.parse(savedContact);
          if (c.phone) setPhone(c.phone);
          if (c.whatsapp) setWhatsapp(c.whatsapp);
          if (c.email) setEmail(c.email);
          if (c.instagram) setInstagram(c.instagram);
          if (c.facebook) setFacebook(c.facebook);
          if (c.tiktok) setTiktok(c.tiktok);
          if (c.welcomeMessage) setWelcomeMessage(c.welcomeMessage);
        } catch (e) {
          console.warn('Could not parse contact settings', e);
        }
      }
    }
  }, [activeChannel]);

  const handleCopyLink = () => {
    if (!activeChannel) return;
    const url = `https://${activeChannel.token.replace(/-token$/, '')}.dobeha.com`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save Puck Builder Layout
  const handleSavePuckLayout = (newData: Data<StorePuckProps>) => {
    if (!activeChannel?.id) return;
    setPuckData(newData);
    localStorage.setItem(`puck_store_page_config_${activeChannel.id}`, JSON.stringify(newData));
    setSuccessMsg('¡Diseño de página guardado exitosamente!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Save Branding Identity (Vendure GraphQL)
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel?.id) return;

    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation UpdateChannel($input: UpdateChannelInput!) {
          updateChannel(input: $input) {
            id
            code
            token
            customFields {
              displayName
              brandColor
              tagline
              themeMode
            }
          }
        }
      `;

      const input = {
        id: activeChannel.id,
        customFields: {
          displayName: displayName.trim(),
          brandColor: brandColor.trim(),
          tagline: tagline.trim(),
          themeMode,
        },
      };

      const res = await VendureClient.request(mutation, { input });
      if (res?.updateChannel?.id) {
        setSuccessMsg('¡Identidad de marca guardada con éxito en el servidor!');
        window.dispatchEvent(new CustomEvent('channel-changed'));
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('No se pudo guardar la configuración en el servidor');
      }
    } catch (err: any) {
      console.error('Error updating channel:', err);
      setErrorMsg(err.message || 'Error al actualizar la configuración de la tienda');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Contact & Social settings
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel?.id) return;

    const contactData = {
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      tiktok: tiktok.trim(),
      welcomeMessage: welcomeMessage.trim(),
    };

    localStorage.setItem(`store_contact_config_${activeChannel.id}`, JSON.stringify(contactData));
    setSuccessMsg('¡Canales de contacto y redes sociales guardados con éxito!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!activeChannel) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
      </div>
    );
  }

  const storeUrl = `https://${activeChannel.token.replace(/-token$/, '')}.dobeha.com`;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                Personalizar Tienda
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 text-[10px] font-bold border border-sky-200 dark:border-sky-800">
                <Sparkles className="h-3 w-3" />
                <span>Puck Builder Activo</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Diseña la página de inicio con bloques visuales, define la identidad de marca y conecta canales de atención.
            </p>
          </div>
        </div>

        {/* Public Store Link badge & AI Assistant */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 shadow-2xs transition cursor-pointer"
            title="Abrir Chat IA para sugerencias de banners, copys y productos"
          >
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Asistente IA</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <Globe className="h-4 w-4 text-sky-500 ml-2 shrink-0" />
            <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-none">
              {storeUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition cursor-pointer shrink-0"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 dark:hover:bg-zinc-800 transition"
              title="Abrir tienda en nueva pestaña"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => handleTabChange('builder')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>1. Constructor Visual (Puck)</span>
          <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 text-[9px] font-mono text-sky-500">
            Drag & Drop
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('branding')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>2. Identidad de Marca</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('contact')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>3. Contacto & Redes</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('preview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>4. Vista Previa Storefront</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-500 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-500 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: PUCK PAGE BUILDER */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20 p-4 text-xs text-zinc-700 dark:text-zinc-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shrink-0">
                <Layers className="h-4 w-4" />
              </span>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">
                  Editor Visual de Página de Inicio con Puck
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Arrastra los componentes desde el cajón lateral, edita sus parámetros en vivo y organízalos como prefieras.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange('preview')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ver Tienda Completa</span>
            </button>
          </div>

          <PuckBuilder
            key={activeChannel.id}
            initialData={puckData}
            channelId={activeChannel.id}
            channelCode={activeChannel.code}
            onSave={handleSavePuckLayout}
            onSwitchToPreview={() => handleTabChange('preview')}
          />
        </div>
      )}

      {/* TAB 2: BRANDING & IDENTITY */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSaveBranding}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-5"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Datos de Marca & Comercio
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nombre Comercial de la Tienda
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Calzados Aurora"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Eslogan / Propuesta de Valor Breve
                </label>
                <textarea
                  rows={3}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ej: Los mejores productos de moda y estilo con envío asegurado..."
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white resize-none"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <Palette className="h-4 w-4" />
                  Color de Identidad de Marca (Primary HEX)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-36 font-mono rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">Paletas sugeridas:</span>
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBrandColor(c)}
                      className="h-5 w-5 rounded-full border border-black/10 transition hover:scale-125"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Theme Mode */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Preferencia de Tema en Storefront
                </label>
                <select
                  value={themeMode}
                  onChange={(e) => setThemeMode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="auto">Automático (Según el sistema del comprador)</option>
                  <option value="light">Tema Claro (Limpio y blanco)</option>
                  <option value="dark">Tema Oscuro (Elegante y nocturno)</option>
                </select>
              </div>

              {/* Technical Multi-Tenant info */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 space-y-1">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Parámetros Multi-Tenant del Servidor:
                </p>
                <p className="font-mono text-[11px]">Código de Canal: <span className="text-zinc-900 dark:text-white font-bold">{activeChannel.code}</span></p>
                <p className="font-mono text-[11px]">Token API: <span className="text-sky-500 font-bold">{activeChannel.token}</span></p>
                <p className="font-mono text-[11px]">Moneda: <span className="text-zinc-900 dark:text-white font-bold">{activeChannel.defaultCurrencyCode || 'USD'}</span></p>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Guardando en el servidor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar Identidad de Marca</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Resumen de Identidad Visual
              </h4>
              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: brandColor }}
                  >
                    {displayName ? displayName.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {displayName || 'Nombre de la Tienda'}
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {tagline || 'Eslogan comercial de tu negocio'}
                    </p>
                  </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700/60 pt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Color principal:</span>
                  <span className="font-mono font-bold" style={{ color: brandColor }}>
                    {brandColor}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Modo de tema:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {themeMode === 'auto' ? 'Automático' : themeMode === 'dark' ? 'Oscuro' : 'Claro'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange('preview')}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                <Eye className="h-4 w-4" />
                <span>Ver cómo luce en el Storefront</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & SOCIAL CHANNELS */}
      {activeTab === 'contact' && (
        <div className="max-w-3xl">
          <form
            onSubmit={handleSaveContact}
            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Canales de Atención y Redes Sociales
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Conecta tu WhatsApp para cierre de ventas directo, atención de reclamos y enlaces a tus redes oficiales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>WhatsApp de Pedidos & Soporte</span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <Phone className="h-3.5 w-3.5 text-sky-500" />
                  <span>Teléfono Fijo / Móvil</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 (601) 234 5678"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <span>Correo Electrónico de Contacto</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="soporte@mitienda.com"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <InstagramIcon />
                  <span>Perfil de Instagram</span>
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@tienda_oficial"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <FacebookIcon />
                  <span>Página de Facebook</span>
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="facebook.com/mitienda"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <Share2 className="h-3.5 w-3.5 text-purple-500" />
                  <span>Cuenta de TikTok</span>
                </label>
                <input
                  type="text"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="@mitienda.tiktok"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Mensaje Predeterminado de WhatsApp (para compras rápidas)
              </label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="¡Hola! Estoy viendo su tienda y me interesa hacer un pedido."
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Contacto & Redes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: STOREFRONT PREVIEW */}
      {activeTab === 'preview' && (
        <StorefrontPreview
          data={puckData}
          storeName={displayName}
          tagline={tagline}
          brandColor={brandColor}
          themeMode={themeMode}
          storeUrl={storeUrl}
          phone={whatsapp || phone}
          email={email}
        />
      )}
    </div>
  );
}
