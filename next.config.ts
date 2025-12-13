// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuração para permitir carregamento de imagens de domínios externos
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'deisishop.pythonanywhere.com',
                port: '',
                pathname: '/media/**', // Permite qualquer caminho dentro de /media
            },
        ],
    },
};

module.exports = nextConfig;