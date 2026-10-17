/**
 * Dobeha Admin - Script de sincronización automática de personalizaciones
 * Copia los componentes, vistas y configuraciones personalizadas desde `src/`
 * hacia el paquete de Vendure Dashboard para garantizar que cualquier `npm install`
 * conserve siempre todas las funcionalidades sin perder cambios.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const filesToSync = [
    {
        from: path.join(rootDir, 'src/components/store-appearance-dialog.tsx'),
        to: path.join(rootDir, 'node_modules/@vendure/dashboard/src/lib/components/shared/store-appearance-dialog.tsx'),
    },
    {
        from: path.join(rootDir, 'src/components/login-form.tsx'),
        to: path.join(rootDir, 'node_modules/@vendure/dashboard/src/lib/components/login/login-form.tsx'),
    },
    {
        from: path.join(rootDir, 'src/routes/login.tsx'),
        to: path.join(rootDir, 'node_modules/@vendure/dashboard/src/app/routes/login.tsx'),
    },
    {
        from: path.join(rootDir, 'src/routes/index.tsx'),
        to: path.join(rootDir, 'node_modules/@vendure/dashboard/src/app/routes/_authenticated/index.tsx'),
    },
];

console.log('🔄 [Dobeha Admin] Sincronizando personalizaciones de UI...');

let successCount = 0;
for (const { from, to } of filesToSync) {
    if (fs.existsSync(from)) {
        const destDir = path.dirname(to);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(from, to);
        successCount++;
        console.log(`  ✓ Sincronizado: ${path.relative(rootDir, from)} -> ${path.relative(rootDir, to)}`);
    } else {
        console.warn(`  ⚠️ Archivo fuente no encontrado: ${path.relative(rootDir, from)}`);
    }
}

console.log(`✨ [Dobeha Admin] ¡${successCount} personalizaciones sincronizadas exitosamente!\n`);
