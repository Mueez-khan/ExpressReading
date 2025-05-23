import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

    server :{

      host : "0.0.0.0",
      fs : {
        strict : false,
      },

    },
  plugins: [react()],
  test: {
    globals: true,  // ✅ Enables global Jest-like APIs (test, expect)
    environment: 'jsdom',  // ✅ Uses jsdom for React component testing
  },
})
