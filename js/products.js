// Catálogo de Productos para Mascotas Elegantes - LuxePaws Royale (Estilo Shopify Plus)
const ANIMAL_CATEGORIES = [
    { id: "all", name: "Todos", icon: "✨", count: 18 },
    { id: "perro", name: "Perros", icon: "🐶", count: 6 },
    { id: "gato", name: "Gatos", icon: "🐱", count: 4 },
    { id: "ave", name: "Aves", icon: "🦜", count: 2 },
    { id: "conejo", name: "Roedores", icon: "🐹", count: 2 },
    { id: "acuario", name: "Acuario", icon: "🐠", count: 2 },
    { id: "medicina", name: "Medicinas", icon: "💊", count: 2 }
];

const CURRENCIES = {
    USD: { symbol: "$", rate: 1.0, name: "USD ($)" },
    EUR: { symbol: "€", rate: 0.92, name: "EUR (€)" },
    MXN: { symbol: "$", rate: 17.50, name: "MXN ($)" },
    COP: { symbol: "$", rate: 3900.0, name: "COP ($)" }
};

const PRODUCTS = [
    {
        id: 1,
        name: "Collar Imperial Swarovsk-Paws® en Seda & Cristales",
        category: "joyas",
        species: "perro",
        price: 89.99,
        originalPrice: 299.99,
        discount: 70,
        rating: 4.9,
        reviewsCount: 1420,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "⚡ TOP VENTAS VIP",
        isFlashSale: true,
        stockLeft: 4,
        totalStock: 50,
        colors: [
            { name: "Oro Rosado", hex: "#e8c39e" },
            { name: "Plata Esterlina", hex: "#d1d5db" },
            { name: "Negro Ónix", hex: "#111827" }
        ],
        sizes: ["S", "M", "L"],
        specs: {
            material: "Seda italiana pura con cristales austríacos Swarovski® y broche bañado en oro rosa 18K.",
            care: "Limpiar con paño microfibra seco. No sumergir en agua clorada.",
            shipping: "Envío Express asegurado en 24-48h con empaque de terciopelo de regalo."
        },
        description: "Collar artesanal confeccionado con seda italiana pura e incrustaciones de cristales tallados a mano. Incluye broche bañado en oro rosa de 18K."
    },
    {
        id: 2,
        name: "Cama Trono Royale de Terciopelo & Patas de Bronce",
        category: "tronos",
        species: "gato",
        price: 149.50,
        originalPrice: 450.00,
        discount: 67,
        rating: 5.0,
        reviewsCount: 890,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "👑 EDICIÓN LIMITADA",
        isFlashSale: true,
        stockLeft: 2,
        totalStock: 25,
        colors: [
            { name: "Verde Esmeralda", hex: "#065f46" },
            { name: "Azul Zafiro", hex: "#1e3a8a" },
            { name: "Borgoña Imperial", hex: "#881337" }
        ],
        sizes: ["M", "L"],
        specs: {
            material: "Terciopelo felpa hidrófugo y estructura con patas de bronce fundido con espuma viscoelástica.",
            care: "Funda lavable a máquina en ciclo delicado a 30°C.",
            shipping: "Empaque rígido protector de caja de madera reciclable."
        },
        description: "Cama ergonómica acolchada en terciopelo royal antimanchas. Estructura elevada con soporte ortopédico de memoria viscoelástica."
    },
    {
        id: 3,
        name: "Plato Gourmet Cerámico Doble con Filamento Dorado",
        category: "gourmet",
        species: "perro",
        price: 34.90,
        originalPrice: 99.00,
        discount: 65,
        rating: 4.8,
        reviewsCount: 2310,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "🔥 MÁS VENDIDO",
        isFlashSale: true,
        stockLeft: 7,
        totalStock: 100,
        colors: [
            { name: "Blanco Mármol", hex: "#f3f4f6" },
            { name: "Negro Mate", hex: "#1f2937" }
        ],
        sizes: ["S", "M"],
        specs: {
            material: "Cerámica artesanal libre de plomo tratada a 1200°C con filamentos dorados en oro de 24K.",
            care: "Apto para lavavajillas. No colocar en microondas.",
            shipping: "Garantía de rotura en transporte con reemplazo inmediato 24h."
        },
        description: "Comedero de cerámica artesanal de alta temperatura con base inclinada a 15° anti-reflujo. Detalles en pan de oro apto para lavavajillas."
    },
    {
        id: 4,
        name: "Jaula Palacio Dorado para Aves Exóticas de Colección",
        category: "tronos",
        species: "ave",
        price: 210.00,
        originalPrice: 550.00,
        discount: 62,
        rating: 4.9,
        reviewsCount: 310,
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "🏛️ ARQUITECTURA REAL",
        isFlashSale: false,
        stockLeft: 3,
        totalStock: 10,
        colors: [
            { name: "Latón Dorado", hex: "#d4af37" }
        ],
        sizes: ["L"],
        specs: {
            material: "Estructura de latón inoxidable tratado con electrolisis dorada y comederos de porcelana.",
            care: "Limpiar periódicamente con paño suave y jabón neutro.",
            shipping: "Desmontable con instructivo impreso y piezas de cristal protegidas."
        },
        description: "Mansión colgante de latón dorado tallado con columpios de cristal y comederos de porcelana fina."
    },
    {
        id: 5,
        name: "Esmoquin Canino Couture para Eventos Gala & Bodas",
        category: "ropa",
        species: "perro",
        price: 64.00,
        originalPrice: 180.00,
        discount: 64,
        rating: 4.9,
        reviewsCount: 654,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "✨ LUJO EXCLUSIVO",
        isFlashSale: false,
        stockLeft: 12,
        totalStock: 30,
        colors: [
            { name: "Negro Gala", hex: "#000000" },
            { name: "Azul Noche", hex: "#0f172a" }
        ],
        sizes: ["XS", "S", "M", "L"],
        specs: {
            material: "Lana fina tropical con solapas en satén de seda y pajarita removible.",
            care: "Lavado en seco profesional.",
            shipping: "Incluye porta-trajes protector antipolvo con gancho miniatura."
        },
        description: "Traje formal de etiqueta con pajarita de satén roja removible y botones perlados."
    },
    {
        id: 6,
        name: "Fuente Bebedero Ultra Silenciosa Neón Smart UV-C",
        category: "tech",
        species: "gato",
        price: 49.99,
        originalPrice: 139.99,
        discount: 64,
        rating: 4.9,
        reviewsCount: 3120,
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "⚡ OFERTA TEMU VIP",
        isFlashSale: true,
        stockLeft: 5,
        totalStock: 80,
        colors: [
            { name: "Blanco Glacial", hex: "#ffffff" },
            { name: "Azul Neón", hex: "#38bdf8" }
        ],
        sizes: ["M"],
        specs: {
            material: "Acero inoxidable 304 de grado médico y bomba de agua sumergible ultra silenciosa (<20dB).",
            care: "Reemplazar el filtro de carbón activado cada 30 días.",
            shipping: "Incluye 3 filtros de repuesto gratis y cable USB-C de nylon trenzado."
        },
        description: "Dispensador continuo de agua purificada con cuádruple sistema de filtración y esterilización UV-C."
    },
    {
        id: 7,
        name: "Montura Imperial de Cuero de Silla & Estribos de Cristal",
        category: "joyas",
        species: "caballo",
        price: 890.00,
        originalPrice: 2400.00,
        discount: 63,
        rating: 5.0,
        reviewsCount: 140,
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "🐴 ÉLITE ECUESTRE",
        isFlashSale: true,
        stockLeft: 1,
        totalStock: 5,
        colors: [
            { name: "Cuero Habano", hex: "#78350f" },
            { name: "Negro Ebano", hex: "#1c1917" }
        ],
        sizes: ["L"],
        specs: {
            material: "Cuero vacuno curtido al vegetal con costuras de hilo reforzado de kevlar y estribos de titanio.",
            care: "Nutrir con bálsamo de cera de abejas una vez al mes.",
            shipping: "Envío especial en guacal protector con funda de ante."
        },
        description: "Montura ecuestre elaborada a mano por guarnicioneros reales con detalles en pan de oro."
    },
    {
        id: 8,
        name: "Rascador Escultural Felino Estilo Neoclásico 1.8m",
        category: "tronos",
        species: "gato",
        price: 199.00,
        originalPrice: 599.00,
        discount: 66,
        rating: 5.0,
        reviewsCount: 412,
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "🏛️ ARTE FELINO",
        isFlashSale: false,
        stockLeft: 3,
        totalStock: 15,
        colors: [
            { name: "Roble Claro", hex: "#d97706" },
            { name: "Marfil Elegante", hex: "#fef3c7" }
        ],
        sizes: ["L"],
        specs: {
            material: "Madera maciza de roble blanco y cuerda de yute sin teñir.",
            care: "Aspirar superficialmente.",
            shipping: "Se entrega parcialmente ensamblado con herramientas de ajuste."
        },
        description: "Mueble de diseño arquitectónico tallado en madera maciza de roble y yute natural orgánico."
    },
    {
        id: 9,
        name: "Mansión Castillo de Madera & Felpa para Conejos VIP",
        category: "tronos",
        species: "conejo",
        price: 110.00,
        originalPrice: 290.00,
        discount: 62,
        rating: 4.9,
        reviewsCount: 520,
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "🐰 PALACIO CONEJO",
        isFlashSale: true,
        stockLeft: 4,
        totalStock: 20,
        colors: [
            { name: "Pino Natural", hex: "#eab308" }
        ],
        sizes: ["M"],
        specs: {
            material: "Madera de pino escandinavo no tratada libre de sustancias tóxicas.",
            care: "Limpieza con paño húmedo sin químicos.",
            shipping: "Envío plano fácil de armar en menos de 10 minutos."
        },
        description: "Castillo modular de pino escandinavo ecológico con rampas de seda sintética suaves."
    },
    {
        id: 10,
        name: "Arnés Inteligente GPS de Cuero Italiano & Zafiro",
        category: "tech",
        species: "perro",
        price: 119.90,
        originalPrice: 349.00,
        discount: 65,
        rating: 4.8,
        reviewsCount: 940,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "📡 RASTREO SMART",
        isFlashSale: true,
        stockLeft: 6,
        totalStock: 60,
        colors: [
            { name: "Marrón Cognac", hex: "#9a3412" },
            { name: "Negro Carbone", hex: "#18181b" }
        ],
        sizes: ["S", "M", "L"],
        specs: {
            material: "Cuero de napa toscana y transmisor hermético resistente al agua IP68 con cristal de zafiro.",
            care: "Recargable mediante base magnética inalámbrica (batería rinde 14 días).",
            shipping: "Incluye 1 año de suscripción a la red satelital GPS global."
        },
        description: "Arnés de cuero napa italiano con chip de localización satelital GPS + SIM 5G integrada."
    },
    {
        id: 11,
        name: "Set Gourmet Treats Trufas & Salmón Silvestre Orgánico",
        category: "gourmet",
        species: "perro",
        price: 24.99,
        originalPrice: 65.00,
        discount: 61,
        rating: 4.9,
        reviewsCount: 4890,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "🍾 DELICATESSEN VIP",
        isFlashSale: true,
        stockLeft: 9,
        totalStock: 120,
        colors: [
            { name: "Edición Gourmet Gold", hex: "#f59e0b" }
        ],
        sizes: ["Pack 3", "Pack 6"],
        specs: {
            material: "Salmón noruego salvaje, aceite de trufa negra, quinua orgánica y antioxidantes naturales.",
            care: "Conservar en lugar fresco y seco.",
            shipping: "Caja hermética de lujo sellada al vacío."
        },
        description: "Bocadillos artesanales elaborados con lomo de salmón salvaje y extracto de trufa negra."
    },
    {
        id: 12,
        name: "Chaqueta Térmica Impermeable Metalizada Champagne",
        category: "ropa",
        species: "perro",
        price: 45.00,
        originalPrice: 120.00,
        discount: 62,
        rating: 4.7,
        reviewsCount: 820,
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "❄️ COLECCIÓN INVIERNO",
        isFlashSale: false,
        stockLeft: 15,
        totalStock: 45,
        colors: [
            { name: "Champagne Gold", hex: "#fde68a" },
            { name: "Plata Neón", hex: "#e5e7eb" }
        ],
        sizes: ["S", "M", "L", "XL"],
        specs: {
            material: "Nylon impermeabilizado con recubrimiento de polímero térmico y plumas sintéticas ecológicas.",
            care: "Lavar a mano con agua fría.",
            shipping: "Empaque de compresión térmico al vacío."
        },
        description: "Abrigo ultraligero con plumón sintético y acabado exterior metalizado en tono Champagne."
    },
    {
        id: 13,
        name: "Gafas de Sol Caninas UV400 'Glamour Aviator Gold'",
        category: "joyas",
        species: "perro",
        price: 19.99,
        originalPrice: 59.99,
        discount: 66,
        rating: 4.9,
        reviewsCount: 1560,
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "😎 TRENDING VIRAL",
        isFlashSale: true,
        stockLeft: 8,
        totalStock: 75,
        colors: [
            { name: "Oro Aviator", hex: "#fbbf24" },
            { name: "Negro Matriz", hex: "#18181b" }
        ],
        sizes: ["S", "M"],
        specs: {
            material: "Montura en aleación ultraligera de titanio con lentes de policarbonato filtrante UV400.",
            care: "Limpiar con pañuelo de microfibra incluido.",
            shipping: "Estuche rígido de piel sintética con mosquetón."
        },
        description: "Lentes de sol con protección UV400 real para perros. Montura ultra ligera en titanio."
    },
    {
        id: 14,
        name: "Arnés Reflector de Seda Imperial para Aves de Exhibición",
        category: "joyas",
        species: "ave",
        price: 32.00,
        originalPrice: 85.00,
        discount: 62,
        rating: 4.8,
        reviewsCount: 190,
        image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "✨ SEDA REAL",
        isFlashSale: false,
        stockLeft: 7,
        totalStock: 25,
        colors: [
            { name: "Rojo Imperial", hex: "#dc2626" },
            { name: "Verde Esmeralda", hex: "#16a34a" }
        ],
        sizes: ["S", "M"],
        specs: {
            material: "Cinta de seda hilada con mosquetón giratorio ultraligero de aluminio.",
            care: "Lavar a mano suavemente.",
            shipping: "Estuche miniatura protector."
        },
        description: "Arnés especial antiescape confeccionado en hilado de seda sin opresión."
    },
    {
        id: 15,
        name: "Bolso Transportador de Lujo Transparente Glass-Capsule",
        category: "tronos",
        species: "gato",
        price: 79.99,
        originalPrice: 220.00,
        discount: 63,
        rating: 4.9,
        reviewsCount: 1940,
        image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-tall",
        badge: "✈️ VIAJERO VIP",
        isFlashSale: true,
        stockLeft: 4,
        totalStock: 40,
        colors: [
            { name: "Rosa Pastel", hex: "#f472b6" },
            { name: "Gris Plata", hex: "#9ca3af" }
        ],
        sizes: ["M"],
        specs: {
            material: "Policarbonato rígido antirrayaduras con malla respirable y alfombrilla interna removible.",
            care: "Limpiar domo traslúcido con spray de agua.",
            shipping: "Apto para cabina de avión (cumple regulaciones IATA)."
        },
        description: "Mochila transportadora rígida panorámica con cúpula traslúcida y ventiladores USB."
    },
    {
        id: 16,
        name: "Manta Mágica Térmica Cashmere para Conejos & Minis",
        category: "ropa",
        species: "conejo",
        price: 28.50,
        originalPrice: 75.00,
        discount: 62,
        rating: 5.0,
        reviewsCount: 380,
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "☁️ CASHMERE",
        isFlashSale: false,
        stockLeft: 10,
        totalStock: 35,
        colors: [
            { name: "Beige Marfil", hex: "#fef3c7" }
        ],
        sizes: ["S", "M"],
        specs: {
            material: "Cashmere sintético ultra denso hipoalergénico con lámina térmica interna autorreflectante.",
            care: "Lavable en lavadora a 30°C.",
            shipping: "Bolsa de satén."
        },
        description: "Cobija ultrasuave auto-calentable confeccionada en cashmere hipoalergénico."
    },
    {
        id: 17,
        name: "Acuario Panorámico Glass Palace 3D & Iluminación LED Coral",
        category: "tronos",
        species: "acuario",
        price: 189.00,
        originalPrice: 420.00,
        discount: 55,
        rating: 4.9,
        reviewsCount: 710,
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "portrait-medium",
        badge: "🐠 PALACIO ACUÁTICO",
        isFlashSale: true,
        stockLeft: 5,
        totalStock: 20,
        colors: [
            { name: "Negro Cristal", hex: "#000000" }
        ],
        sizes: ["20L", "40L"],
        specs: {
            material: "Cristal óptico curvado de alta claridad sin distorsión y bomba con motor de rotor magnético.",
            care: "Limpiar cristales con rasqueta de silicona suave.",
            shipping: "Empaque antichoque reforzado con armazón de madera."
        },
        description: "Acuario curvo de cristal óptico de ultra transparencia con filtro biológico silencioso e iluminación LED multicolor."
    },
    {
        id: 18,
        name: "Elixir Multivitamínico Vitality Royale & Complejo Omega 3-6-9",
        category: "medicina",
        species: "medicina",
        price: 39.99,
        originalPrice: 95.00,
        discount: 58,
        rating: 5.0,
        reviewsCount: 1820,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        hoverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
        ],
        aspectRatio: "square",
        badge: "💊 SALUD & VITALIDAD",
        isFlashSale: false,
        stockLeft: 18,
        totalStock: 60,
        colors: [
            { name: "Frasco Ámbar Royale", hex: "#b45309" }
        ],
        sizes: ["250ml", "500ml"],
        specs: {
            material: "Aceite de bacalao silvestre, biotina, colágeno hidrolizado y vitamina E pura.",
            care: "Refrigerar una vez abierto.",
            shipping: "Frasco de vidrio ámbar graduado con cuentagotas de precisión."
        },
        description: "Suplemento natural líquido para pelaje brillante, refuerzo articular y salud digestiva de mascotas."
    }
];

// Product Upsells sugeridos para el carrito
const CART_UPSELLS = [
    {
        id: 101,
        name: "Bálsamo Hidratante de Huellas Royale",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 102,
        name: "Juguete Pelota Mágica LED Neón",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 103,
        name: "Peine Deslanador Ergonómico de Acero",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=300&q=80"
    }
];

// Preguntas Frecuentes
const FAQ_ITEMS = [
    {
        question: "🚚 ¿Cuáles son los tiempos de envío?",
        answer: "Procesamos todos los pedidos en un plazo de 24 horas laborables. Los envíos express VIP llegan en 24 a 48 horas en todo el país con número de rastreo satelital."
    },
    {
        question: "🔄 ¿Cómo funciona la garantía de cambio de talla?",
        answer: "Ofrecemos cambios de talla 100% gratuitos y sin complicaciones durante los primeros 30 días posteriores a tu compra. ¡Solo contáctanos y pasamos a recoger el paquete!"
    },
    {
        question: "🛡️ ¿Los materiales son seguros para mi mascota?",
        answer: "Absolutamente. Todos nuestros textiles son hipoalergénicos, libres de BPA, y nuestros recipientes de cerámica están certificados libres de plomo."
    },
    {
        question: "💳 ¿Qué métodos de pago aceptan?",
        answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay y opciones de pago en cuotas Klarna."
    }
];

// Simulador de compras en vivo para los Toasts
const LIVE_PURCHASES = [
    { name: "Sofía M.", city: "Madrid", product: "Collar Imperial Swarovsk-Paws®", time: "hace 1 min" },
    { name: "Carlos R.", city: "Barcelona", product: "Cama Trono Royale de Terciopelo", time: "hace 3 min" },
    { name: "Valentina G.", city: "Ciudad de México", product: "Esmoquin Canino Couture", time: "hace 4 min" },
    { name: "Alejandro B.", city: "Buenos Aires", product: "Montura Ecuestre de Cristal", time: "hace 2 min" },
    { name: "Camila D.", city: "Bogotá", product: "Jaula Palacio Dorado para Aves", time: "hace 5 min" },
    { name: "Mateo S.", city: "Santiago", product: "Gafas Caninas Glamour Aviator", time: "hace 1 min" }
];

// Feed Shoppable Instagram / TikTok UGC Grid
const INSTAGRAM_UGC = [
    {
        id: 1,
        username: "@luna_golden_royale",
        petName: "Luna (Golden Retriever)",
        likes: "3.4k",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80",
        productId: 1,
        productName: "Collar Imperial Swarovsk-Paws®"
    },
    {
        id: 2,
        username: "@oliver_the_lord",
        petName: "Oliver (Persa Imperial)",
        likes: "4.8k",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=500&q=80",
        productId: 2,
        productName: "Cama Trono Royale de Terciopelo"
    },
    {
        id: 3,
        username: "@rocky_gala_gentleman",
        petName: "Rocky (French Bulldog)",
        likes: "2.9k",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80",
        productId: 5,
        productName: "Esmoquin Canino Couture"
    },
    {
        id: 4,
        username: "@milo_aviator_style",
        petName: "Milo (Pug VIP)",
        likes: "5.1k",
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80",
        productId: 13,
        productName: "Gafas Caninas Glamour Aviator"
    }
];

// Niveles del Club VIP Royale
const VIP_TIERS = [
    { name: "Bronce Imperial", minPoints: 0, perk: "10 Puntos x $1 gastado" },
    { name: "Plata Royale", minPoints: 500, perk: "Envío Express Gratis Siempre" },
    { name: "Oro Aristócrata", minPoints: 1500, perk: "15% OFF Extra + Regalos Sorpresa" },
    { name: "Diamante Monarca", minPoints: 3000, perk: "Concierge 24/7 + Invitación Eventos" }
];

// Quiz Interactivo "Kit Ideal"
const PET_QUIZ_QUESTIONS = [
    {
        id: 1,
        title: "👑 1. ¿Qué especie es el rey/reina de tu hogar?",
        options: [
            { label: "🐶 Perro Royale", value: "perro", icon: "🐶" },
            { label: "🐱 Gato Imperial", value: "gato", icon: "🐱" },
            { label: "🐰 Conejo / Roedor VIP", value: "conejo", icon: "🐰" }
        ]
    },
    {
        id: 2,
        title: "📏 2. ¿Cuál es su peso o tamaño aprox.?",
        options: [
            { label: "Mini / Peques (< 5 kg)", value: "S", icon: "🐾" },
            { label: "Medianos (5 - 15 kg)", value: "M", icon: "🐕" },
            { label: "Grandes (15+ kg)", value: "L", icon: "🦁" }
        ]
    },
    {
        id: 3,
        title: "✨ 3. ¿Cuál es su personalidad favorita?",
        options: [
            { label: "🛋️ Rey del Sofá (Dormilón & Confort)", value: "tronos", icon: "🛋️" },
            { label: "🍾 Gourmet Exigente (Paladar Fino)", value: "gourmet", icon: "🍾" },
            { label: "💎 Estrella de Gala (Moda & Lujo)", value: "ropa", icon: "💎" }
        ]
    }
];

