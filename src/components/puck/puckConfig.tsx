import { type Config, type Data } from '@puckeditor/core';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Flame,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export interface StorePuckProps {
  // HeroBanner
  HeroBanner: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    bgImage: string;
    bgColor: string;
    align: 'left' | 'center' | 'right';
    height: 'compact' | 'medium' | 'large';
  };
  // FlashSaleBanner
  FlashSaleBanner: {
    badge: string;
    headline: string;
    subheadline: string;
    discountBadge: string;
    timerText: string;
    buttonText: string;
    buttonLink: string;
    styleVariant: 'dark' | 'gradient' | 'vibrant';
  };
  // FeaturedProducts
  FeaturedProducts: {
    sectionTitle: string;
    subtitle: string;
    badgeTag: string;
    columns: '2' | '3' | '4';
    cardStyle: 'modern' | 'minimal' | 'bordered';
  };
  // ValueProps (Trust Badges)
  ValueProps: {
    headline: string;
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
    item4Title: string;
    item4Desc: string;
  };
  // CategoryCards
  CategoryCards: {
    title: string;
    subtitle: string;
    cat1Title: string;
    cat1Image: string;
    cat2Title: string;
    cat2Image: string;
    cat3Title: string;
    cat3Image: string;
  };
  // AnnouncementBar
  AnnouncementBar: {
    message: string;
    badge: string;
    actionText: string;
    actionLink: string;
    bgColor: string;
    textColor: string;
  };
  // Testimonials
  Testimonials: {
    title: string;
    subtitle: string;
    rev1Name: string;
    rev1Role: string;
    rev1Text: string;
    rev2Name: string;
    rev2Role: string;
    rev2Text: string;
    rev3Name: string;
    rev3Role: string;
    rev3Text: string;
  };
  // NewsletterCTA
  NewsletterCTA: {
    badge: string;
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  // StorySection
  StorySection: {
    badge: string;
    title: string;
    content: string;
    quote: string;
    author: string;
    imageUrl: string;
    imagePosition: 'left' | 'right';
  };
  // SpacerDivider
  SpacerDivider: {
    height: 'small' | 'medium' | 'large';
    style: 'empty' | 'line' | 'dashed';
  };
}

export const puckConfig: Config<StorePuckProps> = {
  components: {
    // 1. Hero Banner
    HeroBanner: {
      fields: {
        badge: { type: 'text', label: 'Badge / Etiqueta Superior' },
        title: { type: 'text', label: 'Título Principal' },
        subtitle: { type: 'textarea', label: 'Subtítulo / Bajada' },
        ctaText: { type: 'text', label: 'Texto Botón Primario' },
        ctaLink: { type: 'text', label: 'Enlace Botón Primario' },
        secondaryCtaText: { type: 'text', label: 'Texto Botón Secundario' },
        secondaryCtaLink: { type: 'text', label: 'Enlace Botón Secundario' },
        bgImage: { type: 'text', label: 'URL Imagen de Fondo (opcional)' },
        bgColor: { type: 'text', label: 'Color de Fondo Hex (opcional)' },
        align: {
          type: 'select',
          label: 'Alineación de Texto',
          options: [
            { label: 'Izquierda', value: 'left' },
            { label: 'Centrado', value: 'center' },
            { label: 'Derecha', value: 'right' },
          ],
        },
        height: {
          type: 'select',
          label: 'Altura del Banner',
          options: [
            { label: 'Compacto (340px)', value: 'compact' },
            { label: 'Medio (440px)', value: 'medium' },
            { label: 'Completo (540px)', value: 'large' },
          ],
        },
      },
      defaultProps: {
        badge: '✨ Nueva Colección 2026',
        title: 'Descubre Artículos Exclusivos con Envío a Todo el País',
        subtitle: 'Calidad superior, precios accesibles y atención personalizada para cada pedido.',
        ctaText: 'Explorar Catálogo',
        ctaLink: '#productos',
        secondaryCtaText: 'Ver Promociones',
        secondaryCtaLink: '#ofertas',
        bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
        bgColor: '#0f172a',
        align: 'left',
        height: 'medium',
      },
      render: ({
        badge,
        title,
        subtitle,
        ctaText,
        ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        bgImage,
        bgColor,
        align,
        height,
      }) => {
        const heightClasses = {
          compact: 'min-h-[300px] py-12',
          medium: 'min-h-[420px] py-16',
          large: 'min-h-[520px] py-24',
        }[height || 'medium'];

        const alignClasses = {
          left: 'text-left items-start',
          center: 'text-center items-center mx-auto',
          right: 'text-right items-end ml-auto',
        }[align || 'left'];

        return (
          <div
            className={`relative w-full overflow-hidden flex items-center px-6 sm:px-12 rounded-2xl ${heightClasses}`}
            style={{
              backgroundColor: bgColor || '#0f172a',
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 pointer-events-none" />

            <div className={`relative z-10 max-w-2xl flex flex-col ${alignClasses}`}>
              {badge && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md mb-4 border border-white/20">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>{badge}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-200 mb-8 leading-relaxed max-w-xl">
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {ctaText && (
                  <a
                    href={ctaLink || '#'}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-6 py-3 text-xs sm:text-sm font-bold text-white transition shadow-lg shadow-sky-500/25 cursor-pointer"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                {secondaryCtaText && (
                  <a
                    href={secondaryCtaLink || '#'}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition cursor-pointer"
                  >
                    <span>{secondaryCtaText}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    // 2. Flash Sale Banner
    FlashSaleBanner: {
      fields: {
        badge: { type: 'text', label: 'Badge Superior' },
        headline: { type: 'text', label: 'Título de la Oferta' },
        subheadline: { type: 'text', label: 'Descripción / Términos' },
        discountBadge: { type: 'text', label: 'Porcentaje o Monto Descuento' },
        timerText: { type: 'text', label: 'Texto de Temporizador' },
        buttonText: { type: 'text', label: 'Texto del Botón' },
        buttonLink: { type: 'text', label: 'Enlace' },
        styleVariant: {
          type: 'select',
          label: 'Estilo Visual',
          options: [
            { label: 'Degradado Moderno', value: 'gradient' },
            { label: 'Fondo Oscuro Intenso', value: 'dark' },
            { label: 'Acento Vibrante', value: 'vibrant' },
          ],
        },
      },
      defaultProps: {
        badge: '⚡ OFERTA FLASH LIMITADA',
        headline: 'Mega Descuento de Temporada en Productos Seleccionados',
        subheadline: 'Aprovecha precios únicos antes de que se agoten las existencias.',
        discountBadge: 'HASTA 40% OFF',
        timerText: '⏳ Finaliza en: 06h : 28m : 45s',
        buttonText: 'Comprar con Descuento',
        buttonLink: '#flash-sales',
        styleVariant: 'gradient',
      },
      render: ({
        badge,
        headline,
        subheadline,
        discountBadge,
        timerText,
        buttonText,
        buttonLink,
        styleVariant,
      }) => {
        const bgClasses = {
          gradient: 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 text-white',
          dark: 'bg-zinc-950 border border-zinc-800 text-white',
          vibrant: 'bg-amber-500 text-zinc-950',
        }[styleVariant || 'gradient'];

        return (
          <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-xl ${bgClasses}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Flame className="h-4 w-4 text-amber-300 animate-pulse" />
                  <span>{badge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  {headline}
                </h2>
                <p className="text-xs sm:text-sm opacity-90 max-w-xl">
                  {subheadline}
                </p>
                {timerText && (
                  <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider pt-1">
                    {timerText}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                {discountBadge && (
                  <span className="rounded-xl bg-white text-zinc-900 font-black text-base sm:text-xl px-4 py-1.5 shadow-md">
                    {discountBadge}
                  </span>
                )}
                {buttonText && (
                  <a
                    href={buttonLink || '#'}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    // 3. Featured Products Showcase
    FeaturedProducts: {
      fields: {
        sectionTitle: { type: 'text', label: 'Título de la Sección' },
        subtitle: { type: 'text', label: 'Subtítulo' },
        badgeTag: { type: 'text', label: 'Etiqueta Destacada' },
        columns: {
          type: 'select',
          label: 'Cantidad de Columnas',
          options: [
            { label: '2 Columnas', value: '2' },
            { label: '3 Columnas', value: '3' },
            { label: '4 Columnas', value: '4' },
          ],
        },
        cardStyle: {
          type: 'select',
          label: 'Estilo de Tarjeta',
          options: [
            { label: 'Moderno (Sombra y Badge)', value: 'modern' },
            { label: 'Minimalista (Bordes finos)', value: 'minimal' },
            { label: 'Borde Acentuado', value: 'bordered' },
          ],
        },
      },
      defaultProps: {
        sectionTitle: 'Novedades & Más Vendidos',
        subtitle: 'Artículos seleccionados con máxima popularidad y satisfacción.',
        badgeTag: 'TOP VENTAS',
        columns: '4',
        cardStyle: 'modern',
      },
      render: ({ sectionTitle, subtitle, badgeTag, columns, cardStyle }) => {
        const gridCols = {
          '2': 'grid-cols-1 sm:grid-cols-2',
          '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        }[columns || '4'];

        const mockProducts = [
          {
            id: '1',
            name: 'Auriculares Inalámbricos Pro',
            price: '$79.99',
            originalPrice: '$110.00',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            badge: 'Más Vendido',
            rating: 5,
          },
          {
            id: '2',
            name: 'Smartwatch Deportivo GPS',
            price: '$129.50',
            originalPrice: '$160.00',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            badge: 'Nuevo',
            rating: 4.8,
          },
          {
            id: '3',
            name: 'Mochila Urbana Resistente al Agua',
            price: '$45.00',
            originalPrice: '$60.00',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
            badge: 'Envío Gratis',
            rating: 4.9,
          },
          {
            id: '4',
            name: 'Gafas de Sol Polarizadas Classic',
            price: '$35.00',
            originalPrice: '$50.00',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
            badge: '-30% OFF',
            rating: 4.7,
          },
        ];

        return (
          <div className="py-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                {badgeTag && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                    {badgeTag}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                  {sectionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {subtitle}
                </p>
              </div>
              <a
                href="#catalogo"
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                <span>Ver toda la colección</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className={`grid gap-5 ${gridCols}`}>
              {mockProducts.slice(0, Number(columns || '4')).map((p) => (
                <div
                  key={p.id}
                  className={`group overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 transition hover:-translate-y-1 hover:shadow-lg ${
                    cardStyle === 'bordered'
                      ? 'border-2 border-sky-500/30'
                      : 'border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-lg bg-zinc-900/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {p.badge}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {p.rating}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                      {p.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                        {p.price}
                      </span>
                      <span className="text-xs text-zinc-400 line-through">
                        {p.originalPrice}
                      </span>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Agregar al Carrito</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },

    // 4. Value Props / Trust Badges
    ValueProps: {
      fields: {
        headline: { type: 'text', label: 'Título de la Sección' },
        item1Title: { type: 'text', label: 'Beneficio 1 - Título' },
        item1Desc: { type: 'text', label: 'Beneficio 1 - Descripción' },
        item2Title: { type: 'text', label: 'Beneficio 2 - Título' },
        item2Desc: { type: 'text', label: 'Beneficio 2 - Descripción' },
        item3Title: { type: 'text', label: 'Beneficio 3 - Título' },
        item3Desc: { type: 'text', label: 'Beneficio 3 - Descripción' },
        item4Title: { type: 'text', label: 'Beneficio 4 - Título' },
        item4Desc: { type: 'text', label: 'Beneficio 4 - Descripción' },
      },
      defaultProps: {
        headline: '¿Por qué comprar con nosotros?',
        item1Title: 'Envío Rápido y Seguro',
        item1Desc: 'Despacho prioritario directo a tu puerta con número de seguimiento.',
        item2Title: 'Pago 100% Protegido',
        item2Desc: 'Múltiples métodos de pago con cifrado seguro y contra entrega.',
        item3Title: 'Garantía de Satisfacción',
        item3Desc: '30 días para cambios o devoluciones sin preguntas.',
        item4Title: 'Atención 24/7 en WhatsApp',
        item4Desc: 'Asesoría en tiempo real para resolver todas tus inquietudes.',
      },
      render: ({
        headline,
        item1Title,
        item1Desc,
        item2Title,
        item2Desc,
        item3Title,
        item3Desc,
        item4Title,
        item4Desc,
      }) => {
        const items = [
          { icon: Truck, title: item1Title, desc: item1Desc, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
          { icon: ShieldCheck, title: item2Title, desc: item2Desc, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
          { icon: RotateCcw, title: item3Title, desc: item3Desc, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
          { icon: Headphones, title: item4Title, desc: item4Desc, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
        ];

        return (
          <div className="py-6 space-y-6">
            {headline && (
              <h3 className="text-center text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                {headline}
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-3 ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },

    // 5. Category Navigation Cards
    CategoryCards: {
      fields: {
        title: { type: 'text', label: 'Título de la Sección' },
        subtitle: { type: 'text', label: 'Subtítulo' },
        cat1Title: { type: 'text', label: 'Categoría 1 - Nombre' },
        cat1Image: { type: 'text', label: 'Categoría 1 - Imagen' },
        cat2Title: { type: 'text', label: 'Categoría 2 - Nombre' },
        cat2Image: { type: 'text', label: 'Categoría 2 - Imagen' },
        cat3Title: { type: 'text', label: 'Categoría 3 - Nombre' },
        cat3Image: { type: 'text', label: 'Categoría 3 - Imagen' },
      },
      defaultProps: {
        title: 'Explora Nuestras Categorías',
        subtitle: 'Encuentra las mejores opciones pensadas para ti.',
        cat1Title: 'Tecnología & Accesorios',
        cat1Image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        cat2Title: 'Moda & Calzado',
        cat2Image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        cat3Title: 'Hogar & Estilo de Vida',
        cat3Image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      },
      render: ({
        title,
        subtitle,
        cat1Title,
        cat1Image,
        cat2Title,
        cat2Image,
        cat3Title,
        cat3Image,
      }) => {
        const categories = [
          { name: cat1Title, image: cat1Image },
          { name: cat2Title, image: cat2Image },
          { name: cat3Title, image: cat3Image },
        ];

        return (
          <div className="py-6 space-y-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {categories.map((c, i) => (
                <a
                  key={i}
                  href={`#categoria-${i + 1}`}
                  className="group relative h-48 sm:h-56 overflow-hidden rounded-2xl shadow-sm cursor-pointer"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="font-bold text-sm sm:text-base">{c.name}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-zinc-900 transition">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      },
    },

    // 6. Announcement Bar
    AnnouncementBar: {
      fields: {
        message: { type: 'text', label: 'Mensaje de Aviso' },
        badge: { type: 'text', label: 'Etiqueta / Badge' },
        actionText: { type: 'text', label: 'Texto de Enlace' },
        actionLink: { type: 'text', label: 'URL de Enlace' },
        bgColor: { type: 'text', label: 'Color de Fondo (Hex)' },
        textColor: { type: 'text', label: 'Color de Texto (Hex)' },
      },
      defaultProps: {
        message: '🚚 ¡Envío GRATIS a partir de $49.99 en todo el catálogo!',
        badge: 'PROMOCIÓN',
        actionText: 'Comprar ahora',
        actionLink: '#ofertas',
        bgColor: '#0284c7',
        textColor: '#ffffff',
      },
      render: ({ message, badge, actionText, actionLink, bgColor, textColor }) => {
        return (
          <div
            className="w-full py-2.5 px-4 text-center text-xs flex flex-wrap items-center justify-center gap-2 rounded-xl shadow-xs"
            style={{
              backgroundColor: bgColor || '#0284c7',
              color: textColor || '#ffffff',
            }}
          >
            {badge && (
              <span className="rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-black tracking-wide">
                {badge}
              </span>
            )}
            <span className="font-medium">{message}</span>
            {actionText && (
              <a
                href={actionLink || '#'}
                className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-85"
              >
                <span>{actionText}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      },
    },

    // 7. Testimonials
    Testimonials: {
      fields: {
        title: { type: 'text', label: 'Título de Testimonios' },
        subtitle: { type: 'text', label: 'Subtítulo' },
        rev1Name: { type: 'text', label: 'Cliente 1 - Nombre' },
        rev1Role: { type: 'text', label: 'Cliente 1 - Ubicación / Detalle' },
        rev1Text: { type: 'textarea', label: 'Cliente 1 - Comentario' },
        rev2Name: { type: 'text', label: 'Cliente 2 - Nombre' },
        rev2Role: { type: 'text', label: 'Cliente 2 - Ubicación / Detalle' },
        rev2Text: { type: 'textarea', label: 'Cliente 2 - Comentario' },
        rev3Name: { type: 'text', label: 'Cliente 3 - Nombre' },
        rev3Role: { type: 'text', label: 'Cliente 3 - Ubicación / Detalle' },
        rev3Text: { type: 'textarea', label: 'Cliente 3 - Comentario' },
      },
      defaultProps: {
        title: 'Opiniones de Compradores Reales',
        subtitle: 'Más de 4,800 clientes satisfechos en todo el país.',
        rev1Name: 'Camila Rodriguez',
        rev1Role: 'Compradora Verificada - Bogotá',
        rev1Text: 'El producto llegó en menos de 48 horas. La calidad superó mis expectativas y la atención por WhatsApp fue muy amable.',
        rev2Name: 'Andrés Morales',
        rev2Role: 'Comprador Verificado - Medellín',
        rev2Text: 'Excelente experiencia de compra. Pude pagar contra entrega y el empaque venía 100% protegido. Lo recomiendo totalmente.',
        rev3Name: 'Lucía Fernández',
        rev3Role: 'Compradora Verificada - Cali',
        rev3Text: 'Precios súper competitivos y garantía real. Tuve que cambiar la talla y el proceso fue rápido y sin costo adicional.',
      },
      render: ({
        title,
        subtitle,
        rev1Name,
        rev1Role,
        rev1Text,
        rev2Name,
        rev2Role,
        rev2Text,
        rev3Name,
        rev3Role,
        rev3Text,
      }) => {
        const reviews = [
          { name: rev1Name, role: rev1Role, text: rev1Text },
          { name: rev2Name, role: rev2Role, text: rev2Text },
          { name: rev3Name, role: rev3Role, text: rev3Text },
        ];

        return (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                    "{r.text}"
                  </p>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{r.role}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },

    // 8. Newsletter CTA
    NewsletterCTA: {
      fields: {
        badge: { type: 'text', label: 'Badge Superior' },
        title: { type: 'text', label: 'Título' },
        description: { type: 'textarea', label: 'Descripción' },
        placeholder: { type: 'text', label: 'Placeholder de Entrada' },
        buttonText: { type: 'text', label: 'Texto de Botón' },
      },
      defaultProps: {
        badge: '🎁 BENEFICIO EXCLUSIVO',
        title: 'Suscríbete y Recibe 15% OFF en tu Primer Pedido',
        description: 'Sé el primero en enterarte de nuevos lanzamientos, promociones secretas y descuentos semanales.',
        placeholder: 'Tu correo electrónico...',
        buttonText: 'Quiero mi Descuento',
      },
      render: ({ badge, title, description, placeholder, buttonText }) => {
        return (
          <div className="rounded-2xl bg-zinc-900 dark:bg-zinc-850 p-6 sm:p-10 text-white text-center space-y-4 shadow-xl border border-zinc-800">
            {badge && (
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-amber-300 border border-white/10">
                {badge}
              </span>
            )}
            <h3 className="text-xl sm:text-3xl font-extrabold max-w-xl mx-auto">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder={placeholder || 'Tu correo...'}
                className="w-full sm:flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-sky-500"
              />
              <button
                type="button"
                className="w-full sm:w-auto shrink-0 rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-2.5 text-xs font-bold text-white transition shadow-md shadow-sky-500/20 cursor-pointer"
              >
                {buttonText}
              </button>
            </div>
          </div>
        );
      },
    },

    // 9. Story Section (Historia o Propuesta de Valor)
    StorySection: {
      fields: {
        badge: { type: 'text', label: 'Badge' },
        title: { type: 'text', label: 'Título' },
        content: { type: 'textarea', label: 'Contenido / Historia' },
        quote: { type: 'text', label: 'Cita Destacada' },
        author: { type: 'text', label: 'Firma / Autor' },
        imageUrl: { type: 'text', label: 'URL Imagen' },
        imagePosition: {
          type: 'select',
          label: 'Posición de la Imagen',
          options: [
            { label: 'Derecha', value: 'right' },
            { label: 'Izquierda', value: 'left' },
          ],
        },
      },
      defaultProps: {
        badge: 'NUESTRA HISTORIA',
        title: 'Comprometidos con la Calidad y la Cercanía con Cada Cliente',
        content:
          'Nacimos con la misión de acercar los mejores productos del mercado directamente a tu hogar con la transparencia, honestidad y rapidez que mereces. Cada producto en nuestra tienda ha sido verificado para garantizar la máxima durabilidad y satisfacción.',
        quote: '“El verdadero valor de un comercio radica en la confianza que construye con cada persona que compra.”',
        author: 'Equipo Fundador',
        imageUrl:
          'https://images.unsplash.com/photo-1556742049-0a67e5572240?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'right',
      },
      render: ({
        badge,
        title,
        content,
        quote,
        author,
        imageUrl,
        imagePosition,
      }) => {
        const isImageLeft = imagePosition === 'left';

        return (
          <div className="py-6">
            <div
              className={`flex flex-col gap-8 items-center ${
                isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <div className="flex-1 space-y-4">
                {badge && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {badge}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {content}
                </p>
                {quote && (
                  <blockquote className="border-l-4 border-sky-500 pl-4 py-1 italic text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-zinc-50 dark:bg-zinc-800/40 rounded-r-xl">
                    {quote}
                    {author && (
                      <span className="block not-italic text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                        — {author}
                      </span>
                    )}
                  </blockquote>
                )}
              </div>

              {imageUrl && (
                <div className="w-full lg:w-5/12 overflow-hidden rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-72 w-full object-cover transition hover:scale-105 duration-500"
                  />
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    // 10. Spacer / Divider
    SpacerDivider: {
      fields: {
        height: {
          type: 'select',
          label: 'Espaciado',
          options: [
            { label: 'Pequeño (16px)', value: 'small' },
            { label: 'Mediano (32px)', value: 'medium' },
            { label: 'Grande (56px)', value: 'large' },
          ],
        },
        style: {
          type: 'select',
          label: 'Estilo Visual',
          options: [
            { label: 'Vacío (Espacio transparente)', value: 'empty' },
            { label: 'Línea sutil', value: 'line' },
            { label: 'Línea punteada', value: 'dashed' },
          ],
        },
      },
      defaultProps: {
        height: 'medium',
        style: 'line',
      },
      render: ({ height, style }) => {
        const heightClasses = {
          small: 'py-2',
          medium: 'py-5',
          large: 'py-8',
        }[height || 'medium'];

        return (
          <div className={`w-full flex items-center justify-center ${heightClasses}`}>
            {style === 'line' && (
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            )}
            {style === 'dashed' && (
              <div className="w-full border-t border-dashed border-zinc-300 dark:border-zinc-700" />
            )}
          </div>
        );
      },
    },
  },
};

// Default Templates for fast onboarding
export const defaultStoreData: Data<StorePuckProps> = {
  content: [
    {
      type: 'AnnouncementBar',
      props: {
        id: 'announcement-1',
        message: '🚚 ¡Envíos gratis a todo el país por compras superiores a $50! Código: ENVIOGRATIS',
        badge: 'OFERTA ACTIVA',
        actionText: 'Aprovechar aquí',
        actionLink: '#catalogo',
        bgColor: '#0284c7',
        textColor: '#ffffff',
      },
    },
    {
      type: 'HeroBanner',
      props: {
        id: 'hero-1',
        badge: '✨ Nueva Temporada 2026',
        title: 'Calidad Premium, Estilo Único y Envíos Garantizados',
        subtitle: 'Descubre nuestra selección exclusiva pensada para ofrecerte la mejor experiencia de compra.',
        ctaText: 'Ver Productos',
        ctaLink: '#catalogo',
        secondaryCtaText: 'Promociones Flash',
        secondaryCtaLink: '#ofertas',
        bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
        bgColor: '#0f172a',
        align: 'left',
        height: 'medium',
      },
    },
    {
      type: 'ValueProps',
      props: {
        id: 'values-1',
        headline: '¿Por qué elegir nuestra tienda?',
        item1Title: 'Envío Prioritario',
        item1Desc: 'Despacho rápido con número de rastreo directo a tu teléfono.',
        item2Title: 'Pago Seguro y Contra Entrega',
        item2Desc: 'Paga con tarjeta o al momento de recibir tu paquete.',
        item3Title: 'Garantía Total',
        item3Desc: '30 días para cambios o devoluciones sin costo.',
        item4Title: 'Atención Personalizada',
        item4Desc: 'Canal directo por WhatsApp para resolver cualquier duda.',
      },
    },
    {
      type: 'FlashSaleBanner',
      props: {
        id: 'flash-1',
        badge: '⚡ LIQUIDACIÓN ESPECIAL',
        headline: 'Aprovecha hasta un 40% OFF en Productos Seleccionados',
        subheadline: 'Ofertas válidas por tiempo limitado o hasta agotar existencias en bodega.',
        discountBadge: '40% DE DESCUENTO',
        timerText: '⏳ Finaliza en: 05h : 18m : 32s',
        buttonText: 'Ver Ofertas Disponibles',
        buttonLink: '#ofertas',
        styleVariant: 'gradient',
      },
    },
    {
      type: 'FeaturedProducts',
      props: {
        id: 'featured-1',
        sectionTitle: 'Los Más Populares de la Semana',
        subtitle: 'Artículos con mejores calificaciones de nuestros clientes.',
        badgeTag: 'RECOMENDADOS',
        columns: '4',
        cardStyle: 'modern',
      },
    },
    {
      type: 'CategoryCards',
      props: {
        id: 'categories-1',
        title: 'Explora Nuestras Colecciones Principales',
        subtitle: 'Navega por las categorías más solicitadas de la tienda.',
        cat1Title: 'Tecnología & Gadgets',
        cat1Image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        cat2Title: 'Moda & Tendencias',
        cat2Image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        cat3Title: 'Accesorios & Vida Diaria',
        cat3Image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      type: 'Testimonials',
      props: {
        id: 'testimonials-1',
        title: 'Lo que dicen quienes ya compraron',
        subtitle: 'Miles de familias y negocios confían en nosotros día a día.',
        rev1Name: 'María Cristina Gómez',
        rev1Role: 'Cliente Frecuente',
        rev1Text: 'Llegó en perfectas condiciones y antes de la fecha estimada. Excelente producto.',
        rev2Name: 'Carlos Javier Silva',
        rev2Role: 'Comprador Verificado',
        rev2Text: 'Excelente servicio al cliente. Me asesoraron por WhatsApp para elegir el tamaño adecuado.',
        rev3Name: 'Valentina Restrepo',
        rev3Role: 'Cliente Satisfecha',
        rev3Text: 'Muy buena calidad, los materiales se sienten de primera y el empaque muy cuidado.',
      },
    },
    {
      type: 'NewsletterCTA',
      props: {
        id: 'newsletter-1',
        badge: '🎁 CUPÓN DE BIENVENIDA',
        title: 'Suscríbete y Ahorra 15% en tu Primera Orden',
        description: 'Recibe promociones VIP, alertas de ofertas relámpago y cupones exclusivos directamente en tu bandeja.',
        placeholder: 'Ingresa tu correo aquí...',
        buttonText: 'Suscribirme Gratis',
      },
    },
  ],
  root: { props: { title: 'Página de Inicio' } },
};

// Preset 2: Tech & Gadgets Template
export const techStoreData: Data<StorePuckProps> = {
  content: [
    {
      type: 'AnnouncementBar',
      props: {
        id: 'tech-bar',
        message: '⚡ LLegaron los nuevos dispositivos de alta gama con garantía de 1 año.',
        badge: 'LANZAMIENTO',
        actionText: 'Ver Novedades',
        actionLink: '#tech',
        bgColor: '#0f172a',
        textColor: '#38bdf8',
      },
    },
    {
      type: 'HeroBanner',
      props: {
        id: 'tech-hero',
        badge: '🚀 INNOVACIÓN TECNOLÓGICA',
        title: 'Tecnología de Punta al Alcance de tus Manos',
        subtitle: 'Smartphones, wearables, audio Hi-Fi y accesorios para potenciar tu productividad.',
        ctaText: 'Ver Dispositivos',
        ctaLink: '#gadgets',
        secondaryCtaText: 'Ficha Técnica',
        secondaryCtaLink: '#specs',
        bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
        bgColor: '#020617',
        align: 'left',
        height: 'large',
      },
    },
    {
      type: 'ValueProps',
      props: {
        id: 'tech-values',
        headline: 'Beneficios Oficiales para Tecnología',
        item1Title: 'Garantía 100% Original',
        item1Desc: 'Productos sellados con factura legal y certificación de marca.',
        item2Title: 'Soporte Técnico Especializado',
        item2Desc: 'Te asistimos en la configuración inicial de tu equipo.',
        item3Title: 'Envío Blindado',
        item3Desc: 'Seguro de transporte total contra extravío o daños.',
        item4Title: 'Cuotas Sin Interés',
        item4Desc: 'Financiación disponible con tarjetas participantes.',
      },
    },
    {
      type: 'FeaturedProducts',
      props: {
        id: 'tech-featured',
        sectionTitle: 'Gadgets Más Vendidos',
        subtitle: 'Los dispositivos con mayor rendimiento y mejor relación precio-calidad.',
        badgeTag: 'DESTACADOS TECH',
        columns: '3',
        cardStyle: 'bordered',
      },
    },
    {
      type: 'NewsletterCTA',
      props: {
        id: 'tech-news',
        badge: '⚡ TECH CLUB',
        title: 'Únete a nuestra Comunidad Tech',
        description: 'Recibe comparativas, avisos de stock limitado y cupones de descuento exclusivos.',
        placeholder: 'Tu correo para recibir ofertas...',
        buttonText: 'Unirme al Club',
      },
    },
  ],
  root: { props: { title: 'Tienda de Tecnología' } },
};

// Preset 3: Minimal Fashion
export const fashionStoreData: Data<StorePuckProps> = {
  content: [
    {
      type: 'HeroBanner',
      props: {
        id: 'fash-hero',
        badge: 'MODA & TENDENCIA 2026',
        title: 'Estilo Contemporáneo Diseñado para Ti',
        subtitle: 'Prendas y calzado confeccionados con materiales nobles y cortes modernos.',
        ctaText: 'Colección Femenina',
        ctaLink: '#mujeres',
        secondaryCtaText: 'Colección Masculina',
        secondaryCtaLink: '#hombres',
        bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        bgColor: '#18181b',
        align: 'center',
        height: 'large',
      },
    },
    {
      type: 'FeaturedProducts',
      props: {
        id: 'fash-featured',
        sectionTitle: 'Lookbook de Temporada',
        subtitle: 'Piezas imprescindibles para renovar tu armario con elegancia.',
        badgeTag: 'NUEVAS LLEGADAS',
        columns: '4',
        cardStyle: 'minimal',
      },
    },
    {
      type: 'CategoryCards',
      props: {
        id: 'fash-cats',
        title: 'Líneas de Diseño',
        subtitle: 'Selecciona la categoría que mejor define tu estilo.',
        cat1Title: 'Calzado & Zapatillas',
        cat1Image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        cat2Title: 'Bolsos & Carteras',
        cat2Image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        cat3Title: 'Accesorios & Gafas',
        cat3Image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      type: 'StorySection',
      props: {
        id: 'fash-story',
        badge: 'NUESTRA VISIÓN',
        title: 'Creando Prendas con Identidad y Conciencia',
        content: 'Creemos que vestir bien debe ser sinónimo de comodidad y sustentabilidad. Cada hilo y cada detalle cuenta una historia de dedicación artesanal combinada con diseño actual.',
        quote: '“La elegancia no consiste en llamar la atención, sino en ser recordado.”',
        author: 'Directora Creativa',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
        imagePosition: 'right',
      },
    },
    {
      type: 'NewsletterCTA',
      props: {
        id: 'fash-newsletter',
        badge: 'VIP CLUB',
        title: 'Descubre las Novedades Antes que Nadie',
        description: 'Accede a preventas privadas y catálogos exclusivos de la próxima temporada.',
        placeholder: 'Escribe tu correo aquí...',
        buttonText: 'Acceso VIP',
      },
    },
  ],
  root: { props: { title: 'Tienda de Moda' } },
};
