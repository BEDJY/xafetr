import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

async function getRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

export default async function puckChatHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  let bodyData: any = {};
  try {
    const raw = await getRawBody(req);
    bodyData = JSON.parse(raw || '{}');
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const messages = bodyData.messages || [];
  const lastMessage = messages[messages.length - 1];

  let promptText = '';
  if (typeof lastMessage?.content === 'string') {
    promptText = lastMessage.content;
  } else if (Array.isArray(lastMessage?.parts)) {
    promptText = lastMessage.parts
      .map((p: any) => p.text || '')
      .join(' ')
      .trim();
  }

  const lower = promptText.toLowerCase();

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const sendEvent = (obj: any) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  };

  const messageId = `msg-${Date.now()}`;
  sendEvent({ type: 'text-start', id: messageId });

  let generatedText = '';
  let buildOp: any = null;

  if (
    lower.includes('hero') ||
    lower.includes('banner') ||
    lower.includes('portada') ||
    lower.includes('cabecera') ||
    lower.includes('inicio')
  ) {
    generatedText =
      '¡Listo! He diseñado e insertado un **Hero Banner** con llamada a la acción y fondo moderno en la parte superior de tu tienda.\n\nPuedes hacer clic sobre él en el lienzo para ajustar los textos o el color de identidad.';
    buildOp = {
      op: 'add',
      id: `hero-${Date.now()}`,
      index: 0,
      zone: 'default',
      type: 'HeroBanner',
      props: {
        badge: '✨ Nueva Colección 2026',
        title: 'Descubre Artículos Exclusivos con Envío a Todo el País',
        subtitle:
          'Calidad superior, precios accesibles y atención personalizada en cada compra.',
        ctaText: 'Ver Productos',
        ctaLink: '#catalogo',
        secondaryCtaText: 'Ofertas de Temporada',
        secondaryCtaLink: '#ofertas',
        bgImage:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
        bgColor: '#0f172a',
        align: 'left',
        height: 'medium',
      },
    };
  } else if (
    lower.includes('flash') ||
    lower.includes('oferta') ||
    lower.includes('descuento') ||
    lower.includes('liquid') ||
    lower.includes('promo')
  ) {
    generatedText =
      '¡He creado un bloque de **Ofertas Flash** con contador de tiempo regresivo y botón de compra rápida!';
    buildOp = {
      op: 'add',
      id: `flash-${Date.now()}`,
      index: 1,
      zone: 'default',
      type: 'FlashSaleBanner',
      props: {
        badge: '⚡ LIQUIDACIÓN ESPECIAL',
        headline: 'Hasta 40% OFF en Artículos Seleccionados',
        subheadline:
          'Precios especiales por tiempo limitado o hasta agotar existencias.',
        discountBadge: '40% DE DESCUENTO',
        timerText: '⏳ Finaliza en: 05h : 20m : 45s',
        buttonText: 'Aprovechar Oferta',
        buttonLink: '#ofertas',
        styleVariant: 'gradient',
      },
    };
  } else if (
    lower.includes('producto') ||
    lower.includes('catalogo') ||
    lower.includes('destacado') ||
    lower.includes('venta')
  ) {
    generatedText =
      '¡Agregué la cuadrícula de **Productos Destacados** con diseño moderno, estrellas de calificación y botón de compra!';
    buildOp = {
      op: 'add',
      id: `featured-${Date.now()}`,
      index: 2,
      zone: 'default',
      type: 'FeaturedProducts',
      props: {
        sectionTitle: 'Los Más Populares de la Semana',
        subtitle:
          'Artículos con las mejores calificaciones de nuestros clientes.',
        badgeTag: 'TOP VENTAS',
        columns: '4',
        cardStyle: 'modern',
      },
    };
  } else if (
    lower.includes('beneficio') ||
    lower.includes('confianza') ||
    lower.includes('envio') ||
    lower.includes('garantia') ||
    lower.includes('segur')
  ) {
    generatedText =
      '¡Añadí los **Beneficios & Sellos de Confianza** (Envío rápido, pago contra entrega y garantía de 30 días) para aumentar las ventas de tu tienda!';
    buildOp = {
      op: 'add',
      id: `values-${Date.now()}`,
      index: 1,
      zone: 'default',
      type: 'ValueProps',
      props: {
        headline: '¿Por qué comprar con nosotros?',
        item1Title: 'Envío Rápido y Seguro',
        item1Desc:
          'Despacho prioritario directo a tu hogar con número de seguimiento.',
        item2Title: 'Pago 100% Protegido',
        item2Desc:
          'Aceptamos tarjetas de crédito y pago contra entrega.',
        item3Title: 'Garantía Total',
        item3Desc:
          '30 días para cambios o devoluciones sin costo.',
        item4Title: 'Atención 24/7 en WhatsApp',
        item4Desc:
          'Asesoría personalizada en tiempo real para todas tus compras.',
      },
    };
  } else if (
    lower.includes('testimonio') ||
    lower.includes('opinion') ||
    lower.includes('reseña') ||
    lower.includes('cliente')
  ) {
    generatedText =
      '¡Añadí la sección de **Testimonios de Clientes** con reseñas reales y compradores verificados!';
    buildOp = {
      op: 'add',
      id: `test-${Date.now()}`,
      index: 3,
      zone: 'default',
      type: 'Testimonials',
      props: {
        title: 'Lo que dicen nuestros clientes',
        subtitle:
          'Miles de compradores satisfechos respaldan la calidad de nuestros productos.',
      },
    };
  } else if (
    lower.includes('categoria') ||
    lower.includes('coleccion') ||
    lower.includes('galeria')
  ) {
    generatedText =
      '¡Añadí el explorador visual de **Categorías** para guiar a tus visitantes hacia los productos principales!';
    buildOp = {
      op: 'add',
      id: `cats-${Date.now()}`,
      index: 2,
      zone: 'default',
      type: 'CategoryCards',
      props: {
        title: 'Explora Nuestras Colecciones Principales',
        subtitle: 'Encuentra las mejores opciones según tu estilo.',
      },
    };
  } else if (
    lower.includes('aviso') ||
    lower.includes('anuncio') ||
    lower.includes('alerta')
  ) {
    generatedText =
      '¡Añadí una **Barra de Anuncios Superior** para destacar promociones especiales o avisos de envío gratis!';
    buildOp = {
      op: 'add',
      id: `ann-${Date.now()}`,
      index: 0,
      zone: 'default',
      type: 'AnnouncementBar',
      props: {
        message: '🚚 ¡Envío GRATIS en compras superiores a $50! Código: ENVIOGRATIS',
        badge: 'OFERTA ACTIVA',
        actionText: 'Ver catálogo',
        actionLink: '#catalogo',
      },
    };
  } else {
    generatedText = `✨ **¡Hola! Soy el Asistente Nativo de Puck.**\n\nPuedo crear o modificar bloques en tu página en tiempo real. Prueba escribirme:\n• *"Crea un Hero Banner para ofertas de temporada"*\n• *"Agrega una sección de Ofertas Flash con descuento"*\n• *"Inserta una cuadrícula de Productos Destacados"*\n• *"Agrega sellos de confianza y envío seguro"*\n• *"Añade testimonios de clientes"*\n\n¡Dime qué sección deseas y la colocaré directamente en tu lienzo!`;
  }

  // Dynamic Gemini Copywriting & Customization (if GEMINI_API_KEY is available)
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  if (apiKey && promptText && buildOp?.props) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptInstruction = `Eres un redactor experto en marketing de comercio electrónico.
El usuario pidió para su página web: "${promptText}".
Genera copys atractivos y persuasivos en español. Responde en JSON estricto con los siguientes campos:
{
  "title": "título principal muy llamativo (máx 7 palabras)",
  "subtitle": "descripción o subtítulo persuasivo (máx 15 palabras)",
  "badge": "etiqueta corta destacada (máx 3 palabras)"
}`;
      const genResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: promptInstruction }] }],
        config: { temperature: 0.3 },
      });
      const cleanJson = (genResponse.text || '')
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.title) buildOp.props.title = parsed.title;
      if (parsed.subtitle) buildOp.props.subtitle = parsed.subtitle;
      if (parsed.badge) buildOp.props.badge = parsed.badge;
      generatedText = `✨ **Generado con Gemini AI:**\nHe creado e insertado el componente **${buildOp.type}** con textos personalizados basados en tu solicitud: *"${parsed.title}"*.\n\nYa está visible en tu lienzo y puedes editarlo a tu gusto.`;
    } catch (e) {
      console.warn('Gemini dynamic enhancement fallback to standard preset:', e);
    }
  }

  // Stream text delta
  sendEvent({
    type: 'text-delta',
    id: messageId,
    delta: generatedText,
  });

  // If a component was generated, stream build operation into Puck!
  if (buildOp) {
    sendEvent({
      type: 'data-build-op',
      data: buildOp,
    });
  }

  sendEvent({ type: 'text-end', id: messageId });
  sendEvent({
    type: 'data-finish',
    data: {
      totalCost: 0,
      tokenUsage: {
        inputTokens: 15,
        outputTokens: 75,
        totalTokens: 90,
      },
    },
  });
  sendEvent({ type: 'finish' });
  res.end();
}
