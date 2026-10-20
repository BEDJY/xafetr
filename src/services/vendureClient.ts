/**
 * Cliente HTTP GraphQL para interactuar con la Admin API de Vendure Core
 */

const ONLINE_API_URL =
  'https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app/admin-api';

function resolveVendureApiUrl(): string {
  const isPublishedWeb =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const envUrl = import.meta.env.VITE_VENDURE_API_URL || '';

  // Prohibido estrictamente que la web publicada o build de producción se conecte a localhost/offline
  if (isPublishedWeb || import.meta.env.PROD) {
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    return ONLINE_API_URL;
  }

  return envUrl || ONLINE_API_URL;
}

const API_URL = resolveVendureApiUrl();

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; code?: string }>;
}

export class VendureClient {
  private static tokenKey = 'dobeha_auth_token';
  private static channelKey = 'dobeha_active_channel_token';

  static getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static setAuthToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  static removeAuthToken() {
    localStorage.removeItem(this.tokenKey);
  }

  static getActiveChannelToken(): string | null {
    return localStorage.getItem(this.channelKey);
  }

  static setActiveChannelToken(token: string) {
    localStorage.setItem(this.channelKey, token);
  }

  static removeActiveChannelToken() {
    localStorage.removeItem(this.channelKey);
  }

  /**
   * Ejecuta una query o mutación GraphQL contra Vendure Admin API
   */
  static async request<T = any>(
    query: string,
    variables: Record<string, any> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const channelToken = customHeaders['vendure-token'] !== undefined
      ? customHeaders['vendure-token']
      : this.getActiveChannelToken();
    if (channelToken) {
      headers['vendure-token'] = channelToken;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ query, variables }),
    });

    // Capturar token de sesión devuelto por Vendure en los headers si existe
    const returnedAuthHeader = response.headers.get('vendure-auth-token');
    if (returnedAuthHeader) {
      this.setAuthToken(returnedAuthHeader);
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors && json.errors.length > 0) {
      const err = json.errors[0];
      throw new Error(err.message || 'Error en la petición GraphQL');
    }

    if (!json.data) {
      throw new Error('Respuesta vacía del servidor Vendure');
    }

    return json.data;
  }

  /**
   * Ejecuta una query contra Vendure Shop API (pública, no requiere autenticación obligatoria)
   */
  static async requestShop<T = any>(
    query: string,
    variables: Record<string, any> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    const shopUrl = API_URL.replace('/admin-api', '/shop-api');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const channelToken = customHeaders['vendure-token'] !== undefined
      ? customHeaders['vendure-token']
      : this.getActiveChannelToken();
    if (channelToken) {
      headers['vendure-token'] = channelToken;
    }

    const response = await fetch(shopUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors && json.errors.length > 0) {
      const err = json.errors[0];
      throw new Error(err.message || 'Error en la petición Shop API');
    }

    if (!json.data) {
      throw new Error('Respuesta vacía de la Shop API');
    }

    return json.data;
  }

  /**
   * Sube uno o más archivos multimedia (Assets) a Cloudflare R2 / S3 mediante la especificación GraphQL multipart
   */
  static async uploadAssets(files: File[]): Promise<any[]> {
    if (!files || files.length === 0) return [];

    const operations = {
      query: `
        mutation CreateAssets($input: [CreateAssetInput!]!) {
          createAssets(input: $input) {
            ... on Asset {
              id
              name
              preview
              source
              fileSize
              mimeType
              width
              height
            }
            ... on MimeTypeError {
              message
              fileName
              mimeType
            }
          }
        }
      `,
      variables: {
        input: files.map(() => ({ file: null })),
      },
    };

    const map: Record<string, string[]> = {};
    files.forEach((_, idx) => {
      map[idx.toString()] = [`variables.input.${idx}.file`];
    });

    const formData = new FormData();
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    files.forEach((file, idx) => {
      formData.append(idx.toString(), file);
    });

    const headers: Record<string, string> = {
      'apollo-require-preflight': 'true',
    };

    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const channelToken = this.getActiveChannelToken();
    if (channelToken) {
      headers['vendure-token'] = channelToken;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    const json: GraphQLResponse<{ createAssets: any[] }> = await response.json();

    if (json.errors && json.errors.length > 0) {
      const err = json.errors[0];
      throw new Error(err.message || 'Error al subir los archivos a Cloudflare R2 / S3');
    }

    return json.data?.createAssets || [];
  }
}
