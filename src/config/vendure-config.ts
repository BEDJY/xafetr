import { VendureConfig } from '@vendure/core';

/**
 * Configuración para el cliente del Dashboard.
 * Define la ruta del API de administración para que el Dashboard sepa
 * a qué endpoint de GraphQL enviar las consultas en el Core.
 */
export const config: VendureConfig = {
    apiOptions: {
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
    },
};
