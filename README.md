# BHUMISETU

National land acquisition monitoring dashboard built with React and Vite.

## Run locally

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add the Groq credentials for the local AI assistant.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Open [vercel.com](https://vercel.com), sign in, and choose **Add New Project**.
3. Import the repository. Vercel detects the Vite app; the included `vercel.json` sets the build output.
4. In **Settings > Environment Variables**, add:

```text
GROQ_API_KEY=your-groq-key
GROQ_MODEL=openai/gpt-oss-20b
```

5. Redeploy. The dashboard is served from `dist`, and the AI assistant uses the protected `/api/chat` serverless function.

After deployment, open `https://your-vercel-domain.vercel.app/api/health`. It should return `groqKeyConfigured: true`. If it returns `false`, add the environment variables in Vercel and redeploy.

Never commit `.env.local` or paste the API key into frontend code.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
