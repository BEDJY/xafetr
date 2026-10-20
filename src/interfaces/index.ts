import type { ProductFormFields } from "../types";

export interface LocalizedText {
  en: string;
  ar: string;
  es: string;
  de: string;
  fr: string;
}

export interface ProductVariantBrief {
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

export interface FacetValueBrief {
  id: string;
  name: string;
  code: string;
}

export interface Product {
  id?: string | undefined;
  title: string | LocalizedText;
  description: string | LocalizedText;
  slug?: string;
  enabled?: boolean;
  imageURL: string;
  price: string;
  colors: string[];
  stock?: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  enOfertaFlash?: boolean;
  porcentajeDescuento?: number;
  precioAnterior?: number;
  variants?: ProductVariantBrief[];
  facetValues?: FacetValueBrief[];
  category: {
    name: string;
    imageURL: string;
  };
}

export interface FormInput {
  id: string;
  name: keyof ProductFormFields;
  label: string;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  imageURL: string;
}
