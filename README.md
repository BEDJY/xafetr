# 🌐 Dobeha Admin Dashboard (Producción Cloudflare Pages)

Repositorio oficial para el despliegue del Admin Dashboard de **Dobeha** en **Cloudflare Pages** conectado al Backend Core en **Google Cloud Run**.

---

## 🔗 Servicios Conectados

* **Backend Core (Google Cloud Run):**  
  `https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app`
* **Admin GraphQL API:**  
  `https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app/admin-api`
* **Google OAuth Client ID:**  
  `770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com`
* **Repositorio GitHub:**  
  `https://github.com/BEDJY/xafetr.git`

---

## 🚀 Despliegue en Cloudflare Pages

### Paso 1: Subir cambios a GitHub
Desde esta carpeta (`C:\Users\PC\Documents\ADMIN PANEL\xafetr`), ejecuta en tu terminal:

```bash
git add .
git commit -m "feat: preparar dashboard de vendure para produccion en cloudflare pages"
git push origin main
```

### Paso 2: Conectar el Repositorio en Cloudflare Pages
1. Inicia sesión en el panel de **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. Ve a **Workers & Pages** > **Create application** > pestaña **Pages** > **Connect to Git**.
3. Selecciona tu cuenta de GitHub y el repositorio: **`BEDJY/xafetr`**.
4. Haz clic en **Begin setup**.

### Paso 3: Configurar los Parámetros de Compilación (*Build Settings*)
* **Framework preset:** `Vite` (o `None`)
* **Build command:** `npm run build`
* **Build output directory:** `dist`
* **Root directory:** `/` (dejar en blanco o `/`)

### Paso 4: Configurar Variables de Entorno en Cloudflare (*Environment Variables*)
En la sección **Environment variables (advanced)**, añade las siguientes variables:

| Variable | Valor |
| :--- | :--- |
| `VENDURE_API_HOST` | `https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app` |
| `VENDURE_API_URL` | `https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app` |
| `VITE_VENDURE_API_URL` | `https://xxxxxx-dobeha-core-google-clound-xxxxxx-git-770503141267.us-east1.run.app` |
| `GOOGLE_CLIENT_ID` | `770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com` |
| `VITE_GOOGLE_CLIENT_ID` | `770503141267-0i58clh12je20u31gfq2aalo8hmg7dg6.apps.googleusercontent.com` |
| `NODE_VERSION` | `20` |

### Paso 5: Guardar y Desplegar
Haz clic en **Save and Deploy**. Cloudflare Pages compilará el proyecto automáticamente y te entregará una URL global con certificado SSL (ejemplo: `https://xafetr.pages.dev`).

---

## 📁 Regla de Enrutamiento SPA (`public/_redirects`)

Este repositorio incluye el archivo [`public/_redirects`](./public/_redirects) con la directiva:
```text
/*    /index.html   200
```
Esto garantiza que al refrescar la pantalla en cualquier ruta profunda como `/login` o al alternar tiendas, Cloudflare Pages no devuelva error 404 y permita que TanStack Router gestione la navegación fluidamente en el navegador.

---

## 🛠️ Comandos Locales

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Arranca el panel en modo local en `http://localhost:5180`. |
| `npm run build` | Compila el bundle optimizado para Cloudflare Pages en `dist/`. |
| `npm run preview` | Previsualiza localmente los archivos estáticos de `dist/`. |
| `npm run sync` | Sincroniza personalizaciones de `src/` a `@vendure/dashboard`. |
