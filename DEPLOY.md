# Despliegue en Render — Guía para estudiantes

Publica **tu proyecto** (este repositorio del esqueleto) en [Render](https://render.com) con Docker. Cada `git push` a `main` puede desplegar automáticamente tu API.

---

## Qué vas a conseguir

- Una URL pública tipo `https://tu-nombre-api.onrender.com`
- Tu NestJS accesible desde Postman o el navegador
- Actualización automática al subir cambios a GitHub

---

## Requisitos

1. Cuenta en [GitHub](https://github.com).
2. Cuenta en [Render](https://dashboard.render.com/register) (plan Free vale para practicar).
3. Este proyecto en un **repositorio tuyo** en GitHub (fork o repo nuevo con el contenido del esqueleto).
4. `Dockerfile` funcional en la **raíz** del repo (el formador lo publicará en el curso).
5. Credenciales AWS (cuando la clase lo pida): región, access key, secret y bucket S3.

---

## Paso 1 — Subir el código a GitHub

Si aún no tienes repo:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

---

## Paso 2 — Conectar GitHub con Render

1. [Render Dashboard](https://dashboard.render.com/) → **Account Settings**.
2. **Connect GitHub** y autoriza acceso a tu cuenta.
3. Acepta que Render vea el repositorio del curso.

---

## Paso 3 — Crear el Web Service

1. **New → Web Service**.
2. Elige **tu repositorio** del esqueleto.
3. Configuración recomendada:

| Campo | Valor |
|-------|--------|
| **Name** | `mi-api-credito` (o tu nombre) |
| **Region** | La más cercana (p. ej. Oregon) |
| **Branch** | `main` |
| **Language** | **Docker** |
| **Dockerfile Path** | `Dockerfile` |
| **Instance Type** | Free (laboratorio) |

4. Deja **Auto-Deploy** activado (cada push a `main` vuelve a desplegar).
5. **Create Web Service** y espera el primer build en **Events**.

---

## Paso 4 — Variables de entorno

En tu servicio: **Environment → Add Environment Variable**.

| Variable | Cuándo | Descripción |
|----------|--------|-------------|
| `AWS_REGION` | Clase 1+ | p. ej. `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Clase 1+ | Clave IAM (marcar como **Secret**) |
| `AWS_SECRET_ACCESS_KEY` | Clase 1+ | Secret |
| `AWS_S3_BUCKET` | Clase 1+ | Bucket para PDFs/imágenes |
| `NODE_ENV` | Recomendado | `production` |

Más adelante (clases 8–11), si el formador lo indica:

- `SAGEMAKER_ENDPOINT_RISK`
- `SAGEMAKER_ENDPOINT_AMOUNT`

**No subas `.env` a GitHub.** Solo configura secrets en Render.

---

## Paso 5 — Comprobar el despliegue

Tu URL aparece en la cabecera del servicio: `https://mi-api-credito.onrender.com`.

```bash
curl https://mi-api-credito.onrender.com
```

En plan **Free**, la primera petición tras un rato sin uso puede tardar ~30–60 s (cold start).

Cuando implementes endpoints (clase 1 en adelante), prueba con Postman usando esa URL base.

---

## Flujo de trabajo diario

```bash
# Desarrollo local (opcional)
npm install
npm run start:dev

# Subir cambios → Render despliega solo
git add .
git commit -m "feat: endpoint textract texto"
git push origin main
```

Sigue el progreso en Render → **Events** y **Logs** si algo falla.

---

## Requisitos técnicos (Docker + NestJS)

Tu `Dockerfile` debe compilar y arrancar la app. En `src/main.ts` debe escucharse el puerto de Render:

```typescript
const port = Number(process.env.PORT) || 3000;
await app.listen(port, '0.0.0.0');
```

Render define `PORT` (por defecto **10000**). Ver [Port binding](https://render.com/docs/web-services#port-binding).

- **`docker-compose.yml`**: solo para tu máquina local; Render **no** lo usa.
- Ejecuta `npm run build` en local antes del push si quieres detectar errores de TypeScript pronto.

---

## Health check en Render

El proyecto incluye `GET /health` desde el arranque. En tu servicio Render:

| Campo en Render | Valor |
|-----------------|-------|
| **Health Check Path** | `/health` |

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "esqueleto",
  "timestamp": "2026-05-17T12:00:00.000Z"
}
```

En la clase 11 podrás ampliar comprobaciones en un endpoint adicional del controlador de esa sesión.

---

## Jobs largos en AWS (Glue, SageMaker)

No esperes dentro de un mismo `POST` a que termine un job de Glue o un entrenamiento. Patrón del curso:

1. `POST` → inicia el job → devuelve `jobRunId`
2. `GET` → consultas el estado

Render puede cortar peticiones HTTP muy largas.

---

## `render.yaml` (opcional)

Puedes versionar un Blueprint en la raíz de **tu** repo:

```yaml
services:
  - type: web
    name: mi-api-credito
    runtime: docker
    dockerfilePath: ./Dockerfile
    branch: main
    envVars:
      - key: NODE_ENV
        value: production
      - key: AWS_REGION
        sync: false
      - key: AWS_ACCESS_KEY_ID
        sync: false
      - key: AWS_SECRET_ACCESS_KEY
        sync: false
      - key: AWS_S3_BUCKET
        sync: false
```

Documentación: [Render Blueprints](https://render.com/docs/infrastructure-as-code).

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| Deploy falla al arrancar | `main.ts` usa `PORT` y `'0.0.0.0'` |
| Error en build | `npm run build` en local; commit de `package-lock.json` |
| 502 / timeout | Cold start (Free); revisar **Logs** |
| `AccessDenied` en AWS | Variables en Render e IAM del usuario de práctica |
| Secretos expuestos | No hacer `console.log` de keys; no commitear `.env` |

---

## Checklist

- [ ] Repo propio en GitHub con el esqueleto en la raíz
- [ ] Web Service Render (Docker) con Auto-Deploy
- [ ] Variables AWS en Render (no en Git)
- [ ] Primer deploy en verde
- [ ] `curl` a tu URL responde
- [ ] Postman apunta a `https://tu-servicio.onrender.com`

---

## Referencias

- [Docker on Render](https://render.com/docs/docker)
- [Variables de entorno](https://render.com/docs/configure-environment-variables)
- [README de este proyecto](./README.md) — Docker local con `docker compose`
