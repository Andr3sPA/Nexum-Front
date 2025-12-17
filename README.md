# Nexum-Front

## Descripción

Este es el frontend de la aplicación Nexum, desarrollado con Next.js.

## Tecnologías y versiones

- **Next.js**: ^15.3.3
- **React**: ^18
- **TypeScript**: ^5.8.3
- **Tailwind CSS**: ^3.4.17
- **Bun**: Para gestión de dependencias y ejecución

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables (opcionales, tienen valores por defecto):

- `NEXT_PUBLIC_API_PROFILE_URL`: URL del microservicio de perfil (default: http://localhost:8100/nexum/v1)
- `NEXT_PUBLIC_API_CATALOG_URL`: URL del microservicio de catálogo (default: http://localhost:8110/nexum/v1)
- `NEXT_PUBLIC_API_OPPORTUNITY_URL`: URL del microservicio de oportunidades (default: http://localhost:8120/nexum/v1)

## Configuración y ejecución

1. Instala las dependencias: `bun install`
2. Ejecuta el servidor de desarrollo: `bun run dev`