/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta "Salud Soft" - Identidad Visual
                'salud': {
                    'fondo': '#f8fafc',      // bg-slate-50 - Blanco hueso/gris muy claro
                    'primario': '#0284c7',   // sky-600 - Azul cielo suave
                    'primario-claro': '#e0f2fe', // sky-100 - Fondo azul suave
                    'accion': '#10b981',     // emerald-500 - Verde menta
                    'accion-hover': '#059669', // emerald-600 - Verde menta hover
                    'exito': '#22c55e',      // green-500 - Estado exitoso
                    'error': '#ef4444',      // red-500 - Estado error
                    'pendiente': '#f59e0b',  // amber-500 - Estado pendiente
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            // Tamaños accesibles para personas mayores
            fontSize: {
                'accesible-sm': ['1rem', { lineHeight: '1.5' }],
                'accesible-base': ['1.125rem', { lineHeight: '1.75' }],
                'accesible-lg': ['1.25rem', { lineHeight: '1.75' }],
                'accesible-xl': ['1.5rem', { lineHeight: '2' }],
                'accesible-2xl': ['1.875rem', { lineHeight: '2.25' }],
            },
            // Espaciado para botones táctiles amplios
            spacing: {
                'touch': '3rem', // 48px mínimo para táctil
                'touch-lg': '3.5rem', // 56px para botones grandes
            },
            // Transiciones suaves
            transitionDuration: {
                'smooth': '300ms',
            }
        },
    },
    plugins: [],
}
