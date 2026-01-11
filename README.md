# Voice Agent - Habla con IA

Aplicación web para conversar con IA usando voz, construida con Next.js y OpenAI Realtime API.

## Características

- 🎙️ Interfaz de voz en tiempo real usando OpenAI Realtime API
- 🎨 Diseño minimalista con animaciones suaves
- 🔊 Respuesta de voz de la IA
- 📱 Diseño responsive

## Requisitos

- Node.js 18+ 
- Cuenta de OpenAI con acceso a Realtime API
- API Key de OpenAI

## Instalación

1. Clona o descarga este repositorio

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:
```bash
cp .env.local.example .env.local
```

4. Agrega tu API Key de OpenAI en `.env.local`:
```
OPENAI_API_KEY=sk-proj-tu-api-key-aqui
```

## Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deploy en Vercel

1. Sube tu código a GitHub
2. En Vercel, crea un nuevo proyecto e importa tu repositorio
3. Agrega la variable de entorno `OPENAI_API_KEY` en la configuración del proyecto
4. Deploy automático

## Uso

1. Haz clic en el botón del micrófono para activar
2. El navegador pedirá permiso para usar el micrófono
3. Habla normalmente - la IA responderá con voz
4. Haz clic nuevamente en el botón para desactivar

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- @openai/agents (Realtime Agents SDK)
- OpenAI Realtime API
