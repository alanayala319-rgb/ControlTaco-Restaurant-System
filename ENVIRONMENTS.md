# ControlTaco - Entornos y Gobernanza CI/CD

El flujo de despliegue de ControlTaco respeta la siguiente arquitectura de entornos para garantizar la calidad del código:

## 1. DEV (Development)
- **Propósito:** Entorno de integración donde los desarrolladores prueban el código nuevo.
- **Rama:** Cualquier feature branch antes de hacer merge a `main`.
- **¿Quién puede hacer deploy?** Cualquier desarrollador en su máquina local.
- **Pruebas obligatorias:** Las pruebas unitarias deben ejecutarse localmente.
- **Política de Fallo:** Si las pruebas fallan, el código no se debe pushear o se debe corregir inmediatamente en local.

## 2. QA (Quality Assurance)
- **Propósito:** Entorno de validación automatizada mediante GitHub Actions.
- **Rama:** Pr (Pull Requests) apuntando hacia `main`.
- **¿Quién puede hacer deploy?** GitHub Actions (el CI).
- **Pruebas obligatorias:** El Pipeline ejecuta `npm test` usando Vitest para el backend, garantizando que el nuevo código no rompa la facturación ni la lógica base.
- **Política de Fallo:** Si las pruebas fallan en QA, el Pull Request es bloqueado y no se puede hacer merge a `main`. Se notifica al autor en GitHub.

## 3. PROD (Production)
- **Propósito:** Entorno final donde el usuario interactúa con la aplicación.
- **Rama:** `main`.
- **¿Quién puede hacer deploy?** Despliegue automático (Continuous Deployment) solo al hacer merge en `main`.
- **Pruebas obligatorias:** Debe pasar la compilación del Frontend (`npm run build`) y las pruebas del Backend (`npm test`) en el pipeline de GitHub Actions de forma exitosa (Status Verde).
- **Política de Fallo:** Si algo falla en la rama main, el deploy a Vercel/Render no se ejecuta, manteniendo activa la última versión estable.
