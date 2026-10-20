import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Palette,
  Eye,
  EyeOff,
  Globe,
  DollarSign,
} from 'lucide-react';
import { VendureClient } from '../../services/vendureClient';
import { useAuth } from '../../context/AuthContext';
import { useChannel } from '../../context/ChannelContext';
import { DobehaLogo } from '../../components/common/DobehaLogo';

export default function CreateStorePage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setActiveChannel } = useChannel();

  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#0ea5e9');
  const [currencyCode, setCurrencyCode] = useState('USD');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const presetColors = [
    '#0ea5e9', // Sky Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#18181b', // Dark Slate
  ];

  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    setFieldErrors(prev => ({ ...prev, storeName: '', slug: '' }));
    const sanitized = val
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!storeName.trim()) errors.storeName = 'El nombre de la tienda es obligatorio.';
    if (!slug.trim()) errors.slug = 'El identificador o subdominio es obligatorio.';
    else if (slug.trim().length < 3) errors.slug = 'El slug debe tener al menos 3 caracteres.';
    if (!firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
    if (!lastName.trim()) errors.lastName = 'Los apellidos son obligatorios.';
    if (!emailAddress.trim()) errors.emailAddress = 'El correo electrónico es obligatorio.';
    else if (!emailAddress.includes('@')) errors.emailAddress = 'Ingresa un formato de correo válido.';
    if (!password.trim()) errors.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Por favor revisa los campos señalados en rojo antes de continuar.');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMsg(null);
    setErrorDetail(null);
    setSuccessMsg(null);

    try {
      const mutation = `
        mutation RegisterStore($input: RegisterStoreInput!) {
          registerStore(input: $input) {
            success
            channelId
            channelCode
            channelToken
            administratorId
            message
          }
        }
      `;

      const input = {
        storeName: storeName.trim(),
        slug: slug.trim().toLowerCase(),
        emailAddress: emailAddress.trim().toLowerCase(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        currencyCode,
        brandColor,
        tagline: tagline.trim(),
      };

      // Call shop-api (which is public)
      const res = await VendureClient.requestShop<{ registerStore: any }>(mutation, { input }, { 'vendure-token': '' });
      const result = res?.registerStore;

      if (!result?.success) {
        throw new Error(result?.message || 'Error al crear la tienda');
      }

      setSuccessMsg(`¡Tu tienda "${storeName}" ha sido creada con éxito! Iniciando sesión...`);

      // Auto login the merchant with their new credentials and activate their channel immediately
      try {
        await login(emailAddress.trim(), password.trim(), result.channelToken);
        VendureClient.setActiveChannelToken(result.channelToken);
        setActiveChannel({
          id: result.channelId,
          code: result.channelCode,
          token: result.channelToken,
          defaultCurrencyCode: currencyCode,
          customFields: {
            displayName: storeName.trim(),
            brandColor: brandColor || '#0ea5e9',
            tagline: tagline.trim() || '',
            themeMode: 'auto',
          },
        });
      } catch (loginErr) {
        console.warn('Auto-login notice:', loginErr);
      }

      window.dispatchEvent(new CustomEvent('channel-changed'));

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error('Registration error:', err);
      const rawMsg = err.message || '';
      let userFriendlyMsg = rawMsg;
      const fErrors: Record<string, string> = {};

      if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError') || rawMsg.includes('ECONNREFUSED')) {
        userFriendlyMsg = 'No se pudo conectar con el servidor backend (http://localhost:3000). Por favor verifica que el backend de Vendure esté en ejecución.';
      } else if (rawMsg.toLowerCase().includes('correo') || rawMsg.toLowerCase().includes('email') || rawMsg.includes('already exists')) {
        fErrors.emailAddress = 'Este correo electrónico ya está registrado en Dokkany.';
        userFriendlyMsg = `El correo "${emailAddress}" ya pertenece a una cuenta registrada. Puedes iniciar sesión o utilizar otro correo diferente.`;
      } else if (rawMsg.toLowerCase().includes('slug') || rawMsg.toLowerCase().includes('identificador') || rawMsg.includes('unique constraint') || rawMsg.includes('duplicate key')) {
        fErrors.slug = `El subdominio o slug "${slug}" ya está en uso por otra tienda.`;
        userFriendlyMsg = `Ya existe una tienda con el identificador "${slug}". Elige otro nombre o slug para tu tienda.`;
      } else if (rawMsg.toLowerCase().includes('contraseña') || rawMsg.toLowerCase().includes('password')) {
        fErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        userFriendlyMsg = 'La contraseña ingresada no cumple con los requisitos mínimos de seguridad.';
      }

      setFieldErrors(fErrors);
      setErrorMsg(userFriendlyMsg);
      setErrorDetail(rawMsg !== userFriendlyMsg ? rawMsg : null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-100 lg:flex-row">
      {/* ================= LEFT HERO PANEL ================= */}
      <div className="relative flex w-full flex-col justify-between overflow-hidden border-b border-zinc-800 bg-linear-to-br from-zinc-950 via-zinc-900 to-indigo-950/50 p-6 sm:p-10 lg:w-5/12 lg:border-r lg:border-b-0 lg:p-14">
        {/* Glow decorative orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        {/* Top brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <DobehaLogo size="md" />
          </Link>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            SaaS Platform
          </span>
        </div>

        {/* Hero message */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1.5 text-xs font-medium text-sky-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            Crea tu tienda online tipo Shopify
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Comienza a vender <br />
            <span className="bg-linear-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              con tu propia marca hoy mismo
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Obtén tu catálogo independiente, panel de inventario en tiempo real, control de ofertas flash y métodos de pago listos para cobrar.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                ✓
              </div>
              <span>Canal y subdominio multi-tenant 100% aislado</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                ✓
              </div>
              <span>Alojamiento de imágenes en Cloudflare R2 de alta velocidad</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                ✓
              </div>
              <span>Panel administrativo completo DOBEHA sin límite de productos</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-zinc-500">
          ¿Ya tienes una tienda?{' '}
          <Link to="/login" className="font-semibold text-sky-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-xl space-y-6">
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-inner">
            <Link
              to="/login"
              className="py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-all flex items-center justify-center gap-2 text-center"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Iniciar Sesión</span>
            </Link>
            <button
              type="button"
              className="py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/30 cursor-default flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-sky-200" />
              <span>Crear Nueva Tienda</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Abre tu Tienda en Segundos
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Completa el formulario para aprovisionar tu entorno ecommerce de forma automática.
            </p>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200 shadow-lg shadow-rose-950/20 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h4 className="font-bold text-rose-300 text-sm">Error al Registrar la Tienda</h4>
                  <p className="leading-relaxed text-zinc-300">{errorMsg}</p>
                  {(errorMsg.includes('ya pertenece a una cuenta') || errorMsg.includes('ya está registrado')) && (
                    <div className="pt-1.5">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition shadow-xs cursor-pointer"
                      >
                        <span>Iniciar Sesión con esta cuenta existente →</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {errorDetail && (
                <details className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-zinc-400">
                  <summary className="cursor-pointer hover:text-zinc-200 font-mono">Ver detalle técnico del servidor</summary>
                  <pre className="mt-1 p-2 rounded bg-zinc-950/80 text-rose-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
                    {errorDetail}
                  </pre>
                </details>
              )}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-500">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name & Slug */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nombre de la Tienda *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  placeholder="Ej: Calzados Aurora, Tech Nova"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    fieldErrors.storeName ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 bg-zinc-900 focus:border-sky-500'
                  }`}
                />
              </div>
              {fieldErrors.storeName && (
                <p className="mt-1 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{fieldErrors.storeName}</span>
                </p>
              )}
            </div>

            {/* Subdomain Preview */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Subdominio & Enlace Único de tu Tienda *
              </label>
              <div className={`flex items-center rounded-xl border px-3 py-2 text-xs font-mono text-zinc-400 transition ${
                fieldErrors.slug ? 'border-rose-500 bg-rose-500/5' : 'border-zinc-800 bg-zinc-900/80'
              }`}>
                <Globe className="h-3.5 w-3.5 text-sky-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setFieldErrors(prev => ({ ...prev, slug: '' }));
                  }}
                  placeholder="mi-tienda"
                  className="bg-transparent font-bold text-sky-400 outline-none w-36 truncate"
                />
                <span className="text-zinc-500 truncate">.dobeha.com</span>
              </div>
              {fieldErrors.slug ? (
                <p className="mt-1 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{fieldErrors.slug}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-zinc-500">
                  Tus clientes entrarán a esta URL para comprar en tu tienda.
                </p>
              )}
            </div>

            {/* Merchant Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFieldErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  placeholder="Carlos"
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    fieldErrors.firstName ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 bg-zinc-900 focus:border-sky-500'
                  }`}
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFieldErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Gómez"
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    fieldErrors.lastName ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 bg-zinc-900 focus:border-sky-500'
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Correo Electrónico (Tu Acceso) *
                </label>
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                    setFieldErrors(prev => ({ ...prev, emailAddress: '' }));
                  }}
                  placeholder="admin@mitienda.com"
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    fieldErrors.emailAddress ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 bg-zinc-900 focus:border-sky-500'
                  }`}
                />
                {fieldErrors.emailAddress && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{fieldErrors.emailAddress}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Contraseña de Administrador *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full rounded-xl border py-2 pl-3.5 pr-9 text-xs text-white placeholder-zinc-500 outline-none transition ${
                      fieldErrors.password ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 bg-zinc-900 focus:border-sky-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Slogan */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Eslogan de la Tienda (Opcional)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ej: Ropa exclusiva y estilo urbano con envíos a todo el país"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* Brand Color & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                  <Palette className="h-3.5 w-3.5" />
                  Color de Marca (HEX)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-full font-mono rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
                <div className="mt-2 flex gap-1.5">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBrandColor(c)}
                      className="h-4 w-4 rounded-full border border-black/20 transition hover:scale-125"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Moneda Principal
                </label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="USD">USD ($ - Dólar Estadounidense)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="MXN">MXN ($ - Peso Mexicano)</option>
                  <option value="COP">COP ($ - Peso Colombiano)</option>
                  <option value="ARS">ARS ($ - Peso Argentino)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Aprovisionando tu Tienda...</span>
                  </>
                ) : (
                  <>
                    <span>Crear Mi Tienda Online Ahora</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
