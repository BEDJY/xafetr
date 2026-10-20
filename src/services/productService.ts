import { VendureClient } from './vendureClient';

export interface FacetValueItem {
  id: string;
  name: string;
  code: string;
}

export interface FacetItem {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  values: FacetValueItem[];
}

export interface FullProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockOnHand: number;
  product?: {
    id: string;
    name: string;
    featuredAsset?: {
      preview: string;
    };
  };
  options?: Array<{
    id: string;
    name: string;
    code: string;
    group?: {
      name: string;
    };
  }>;
  facetValues?: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  customFields?: {
    enOfertaFlash?: boolean;
    porcentajeDescuento?: number;
    precioAnterior?: number;
  };
}

export interface ProductVariantItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockOnHand: number;
  customFields?: {
    enOfertaFlash?: boolean;
    porcentajeDescuento?: number;
    precioAnterior?: number;
  };
}

export interface VendureProduct {
  id: string;
  name: string;
  slug: string;
  enabled?: boolean;
  description: string;
  featuredAsset?: {
    id: string;
    preview: string;
  };
  variants: ProductVariantItem[];
  facetValues?: FacetValueItem[];
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  enabled?: boolean;
  description: string;
  price: number; // en dólares/moneda principal (ej: 25.50)
  sku: string;
  stock?: number;
  enOfertaFlash?: boolean;
  porcentajeDescuento?: number;
  precioAnterior?: number; // en centavos
  imageURL?: string;
}

export interface UpdateProductPayload {
  id: string;
  name: string;
  slug?: string;
  enabled?: boolean;
  description: string;
  variantId?: string;
  price: number;
  stock?: number;
  enOfertaFlash?: boolean;
  porcentajeDescuento?: number;
  precioAnterior?: number;
}

const PRODUCTS_QUERY = `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        enabled
        description
        featuredAsset {
          id
          preview
        }
        variants {
          id
          name
          sku
          price
          stockOnHand
          customFields {
            enOfertaFlash
            porcentajeDescuento
            precioAnterior
          }
        }
        facetValues {
          id
          name
          code
        }
      }
      totalItems
    }
  }
`;

const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      enabled
      description
    }
  }
`;

const CREATE_PRODUCT_VARIANTS_MUTATION = `
  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) {
      id
      name
      sku
      price
      stockOnHand
      customFields {
        enOfertaFlash
        porcentajeDescuento
        precioAnterior
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      slug
      enabled
      description
    }
  }
`;

const UPDATE_VARIANT_MUTATION = `
  mutation UpdateProductVariantFlashSale($input: [UpdateProductVariantInput!]!) {
    updateProductVariants(input: $input) {
      id
      name
      price
      stockOnHand
      customFields {
        enOfertaFlash
        porcentajeDescuento
        precioAnterior
      }
    }
  }
`;

const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      result
      message
    }
  }
`;

const FACETS_QUERY = `
  query GetFacets($options: FacetListOptions) {
    facets(options: $options) {
      totalItems
      items {
        id
        name
        code
        isPrivate
        values {
          id
          name
          code
        }
      }
    }
  }
`;

const CREATE_FACET_MUTATION = `
  mutation CreateFacet($input: CreateFacetInput!) {
    createFacet(input: $input) {
      id
      name
      code
      isPrivate
      values {
        id
        name
        code
      }
    }
  }
`;

const CREATE_FACET_VALUES_MUTATION = `
  mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
    createFacetValues(input: $input) {
      id
      name
      code
    }
  }
`;

const ALL_VARIANTS_QUERY = `
  query GetAllVariants($options: ProductVariantListOptions) {
    productVariants(options: $options) {
      totalItems
      items {
        id
        name
        sku
        price
        stockOnHand
        product {
          id
          name
          featuredAsset {
            preview
          }
        }
        options {
          id
          name
          code
          group {
            name
          }
        }
        facetValues {
          id
          name
          code
        }
        customFields {
          enOfertaFlash
          porcentajeDescuento
          precioAnterior
        }
      }
    }
  }
`;

const UPDATE_VARIANT_ITEM_MUTATION = `
  mutation UpdateVariantItem($input: [UpdateProductVariantInput!]!) {
    updateProductVariants(input: $input) {
      id
      name
      sku
      price
      stockOnHand
      customFields {
        enOfertaFlash
        porcentajeDescuento
        precioAnterior
      }
    }
  }
`;


function slugify(text: string): string {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/[^\w-]+/g, '') // Quitar caracteres no alfanuméricos
      .replace(/--+/g, '-') +
    '-' +
    Math.random().toString(36).substring(2, 6)
  );
}

export class ProductService {
  static async getProducts(take = 100, skip = 0): Promise<{ items: VendureProduct[]; totalItems: number }> {
    try {
      const data = await VendureClient.request<{
        products: { items: VendureProduct[]; totalItems: number };
      }>(PRODUCTS_QUERY, { options: { take, skip } });
      if (data?.products?.items && data.products.items.length > 0) {
        return data.products;
      }
    } catch {
      // Continuar con fallback mediante Shop API si no hay sesión activa aún
    }

    try {
      const shopQuery = `
        query GetShopProducts($options: ProductListOptions) {
          products(options: $options) {
            totalItems
            items {
              id
              name
              slug
              description
              featuredAsset {
                id
                preview
              }
              variants {
                id
                name
                sku
                price
                customFields {
                  enOfertaFlash
                  porcentajeDescuento
                  precioAnterior
                }
              }
            }
          }
        }
      `;
      const shopData = await VendureClient.requestShop<{
        products: { items: any[]; totalItems: number };
      }>(shopQuery, { options: { take, skip } });

      const mappedItems: VendureProduct[] = (shopData?.products?.items || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        featuredAsset: p.featuredAsset,
        variants: (p.variants || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stockOnHand: 25,
          customFields: v.customFields,
        })),
      }));

      return {
        items: mappedItems,
        totalItems: shopData?.products?.totalItems || mappedItems.length,
      };
    } catch (err) {
      console.warn('Error al obtener productos de Vendure:', err);
      return { items: [], totalItems: 0 };
    }
  }

  static async createProduct(payload: CreateProductPayload): Promise<VendureProduct> {
    const slug = payload.slug || slugify(payload.name);
    const priceCents = Math.round(payload.price * 100);

    // 1. Crear producto base
    const productInput: any = {
      translations: [
        {
          languageCode: 'es',
          name: payload.name,
          slug,
          description: payload.description,
        },
      ],
    };
    if (payload.enabled !== undefined) {
      productInput.enabled = payload.enabled;
    }

    const productRes = await VendureClient.request<{ createProduct: VendureProduct }>(
      CREATE_PRODUCT_MUTATION,
      {
        input: productInput,
      }
    );

    const createdProduct = productRes.createProduct;

    // 2. Crear variante con precio y customFields de oferta flash
    try {
      const variantRes = await VendureClient.request<{
        createProductVariants: ProductVariantItem[];
      }>(CREATE_PRODUCT_VARIANTS_MUTATION, {
        input: [
          {
            productId: createdProduct.id,
            sku: payload.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
            price: priceCents,
            stockOnHand: payload.stock ?? 15,
            translations: [
              {
                languageCode: 'es',
                name: payload.name,
              },
            ],
            customFields: {
              enOfertaFlash: Boolean(payload.enOfertaFlash),
              porcentajeDescuento: payload.porcentajeDescuento || 0,
              precioAnterior: payload.precioAnterior || null,
            },
          },
        ],
      });

      createdProduct.variants = variantRes.createProductVariants;
    } catch (variantErr) {
      console.warn('Aviso al crear variante inicial de producto:', variantErr);
    }

    return createdProduct;
  }

  static async updateProduct(payload: UpdateProductPayload): Promise<void> {
    // 1. Actualizar texto de producto si aplica
    const input: any = {
      id: payload.id,
      translations: [
        {
          languageCode: 'es',
          name: payload.name,
          description: payload.description,
        },
      ],
    };
    if (payload.slug) {
      input.translations[0].slug = payload.slug;
    }
    if (payload.enabled !== undefined) {
      input.enabled = payload.enabled;
    }

    await VendureClient.request(UPDATE_PRODUCT_MUTATION, { input });

    // 2. Actualizar variante si se tiene variantId
    if (payload.variantId) {
      const priceCents = Math.round(payload.price * 100);
      await VendureClient.request(UPDATE_VARIANT_MUTATION, {
        input: [
          {
            id: payload.variantId,
            price: priceCents,
            stockOnHand: payload.stock ?? 15,
            customFields: {
              enOfertaFlash: Boolean(payload.enOfertaFlash),
              porcentajeDescuento: payload.porcentajeDescuento || 0,
              precioAnterior: payload.precioAnterior || null,
            },
          },
        ],
      });
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    await VendureClient.request(DELETE_PRODUCT_MUTATION, { id });
  }

  // =========================================================================
  // GESTIÓN DE FACETAS (FACETS & FILTROS)
  // =========================================================================

  static async getFacets(): Promise<FacetItem[]> {
    try {
      const res = await VendureClient.request<{ facets: { items: FacetItem[] } }>(FACETS_QUERY);
      return res.facets.items || [];
    } catch (err) {
      console.warn('Aviso al obtener facetas de Vendure:', err);
      return [];
    }
  }

  static async createFacet(name: string, code?: string, initialValues: string[] = []): Promise<FacetItem> {
    const finalCode = code || slugify(name);
    const valuesInput = initialValues.map((v) => ({
      code: slugify(v),
      translations: [{ languageCode: 'es', name: v }],
    }));

    const res = await VendureClient.request<{ createFacet: FacetItem }>(CREATE_FACET_MUTATION, {
      input: {
        code: finalCode,
        isPrivate: false,
        translations: [{ languageCode: 'es', name }],
        values: valuesInput.length > 0 ? valuesInput : undefined,
      },
    });
    return res.createFacet;
  }

  static async addFacetValue(facetId: string, name: string, code?: string): Promise<FacetValueItem[]> {
    const finalCode = code || slugify(name);
    const res = await VendureClient.request<{ createFacetValues: FacetValueItem[] }>(
      CREATE_FACET_VALUES_MUTATION,
      {
        input: [
          {
            facetId,
            code: finalCode,
            translations: [{ languageCode: 'es', name }],
          },
        ],
      }
    );
    return res.createFacetValues;
  }

  // =========================================================================
  // GESTIÓN CONSOLIDADA DE VARIANTES DE PRODUCTO
  // =========================================================================

  static async getProductVariants(
    take = 100,
    skip = 0
  ): Promise<{ items: FullProductVariant[]; totalItems: number }> {
    try {
      const res = await VendureClient.request<{
        productVariants: { items: FullProductVariant[]; totalItems: number };
      }>(ALL_VARIANTS_QUERY, { options: { take, skip } });
      return res.productVariants || { items: [], totalItems: 0 };
    } catch (err) {
      console.warn('Aviso al obtener variantes de producto:', err);
      return { items: [], totalItems: 0 };
    }
  }

  static async updateVariant(payload: {
    id: string;
    price?: number;
    stockOnHand?: number;
    sku?: string;
    enOfertaFlash?: boolean;
    porcentajeDescuento?: number;
    precioAnterior?: number;
  }): Promise<void> {
    const input: any = { id: payload.id };
    if (payload.price !== undefined) {
      input.price = Math.round(payload.price * 100);
    }
    if (payload.stockOnHand !== undefined) {
      input.stockOnHand = payload.stockOnHand;
    }
    if (payload.sku !== undefined) {
      input.sku = payload.sku;
    }
    if (
      payload.enOfertaFlash !== undefined ||
      payload.porcentajeDescuento !== undefined ||
      payload.precioAnterior !== undefined
    ) {
      input.customFields = {
        enOfertaFlash: Boolean(payload.enOfertaFlash),
        porcentajeDescuento: payload.porcentajeDescuento ?? 0,
        precioAnterior: payload.precioAnterior ?? null,
      };
    }

    await VendureClient.request(UPDATE_VARIANT_ITEM_MUTATION, {
      input: [input],
    });
  }

  static async createProductVariants(input: any[]): Promise<void> {
    await VendureClient.request(CREATE_PRODUCT_VARIANTS_MUTATION, {
      input,
    });
  }

  static async addVariantToProduct(payload: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    stockOnHand?: number;
    enOfertaFlash?: boolean;
    porcentajeDescuento?: number;
    precioAnterior?: number;
  }): Promise<void> {
    const priceCents = Math.round(payload.price * 100);
    await VendureClient.request(CREATE_PRODUCT_VARIANTS_MUTATION, {
      input: [
        {
          productId: payload.productId,
          sku: payload.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          price: priceCents,
          stockOnHand: payload.stockOnHand ?? 15,
          translations: [
            {
              languageCode: 'es',
              name: payload.name,
            },
          ],
          customFields: {
            enOfertaFlash: Boolean(payload.enOfertaFlash),
            porcentajeDescuento: payload.porcentajeDescuento || 0,
            precioAnterior: payload.precioAnterior || null,
          },
        },
      ],
    });
  }
}
