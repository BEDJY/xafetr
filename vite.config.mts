import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiUrl = env.VENDURE_API_URL || env.VENDURE_API_HOST || 'https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app';
    let url: URL;
    try {
        url = new URL(apiUrl);
    } catch {
        url = new URL('https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app');
    }

    const host = `${url.protocol}//${url.hostname}`;
    const port = url.port ? Number(url.port) : (url.protocol === 'https:' ? 443 : 80);

    return {
        base: '/',
        build: {
            outDir: join(__dirname, 'dist'),
        },
        plugins: [
            {
                name: 'redirect-dashboard-to-root',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        if (req.url === '/dashboard' || req.url === '/dashboard/') {
                            res.writeHead(302, { Location: '/' });
                            res.end();
                            return;
                        }
                        next();
                    });
                },
            },
            vendureDashboardPlugin({
                vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
                api: {
                    host,
                    port,
                    adminApiPath: 'admin-api',
                },
                gqlOutputPath: './src/gql',
            }),
        ],
        server: {
            port: Number(env.PORT) || 5180,
            fs: {
                strict: false,
            },
        },
        resolve: {
            alias: {
                '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
                '@/components': resolve(__dirname, './src/components'),
                '@/routes': resolve(__dirname, './src/routes'),
                '@/config': resolve(__dirname, './src/config'),
            },
        },
        define: {
            'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(
                env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com'
            ),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(
                env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com'
            ),
            'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(
                env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com'
            ),
        },
    };
});
