import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import packageLockJson from './package-lock.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        GEOSTYLER_VERSION: JSON.stringify(packageLockJson.packages['node_modules/geostyler'].version),
    }
});
