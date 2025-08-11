import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load env files
    const env = loadEnv(mode, '.', '');
    
    return {
      define: {
        // Make environment variables available to the app
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        // Configure development server
        port: 5174,
        strictPort: true,
        host: true,
        open: true,
      }
    };
});
