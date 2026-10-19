/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#09090B',
        surface: '#121215',
        elevated: '#18181B',
        // Sistema MeuBotequim - Paleta Tons Terrosos Pastel
        botequim: {
          bg: '#FAF6F0',          // Fundo Geral (Areia / Off-white quente)
          card: '#FFFFFF',        // Fundo de Cards / Containers
          border: '#EFE8DE',      // Bordas e Divisórias (Linho suave)
          primary: '#C87A5B',     // Cor Primária de Ação (Terracota Pastel)
          'primary-hover': '#B2684B',
          secondary: '#DDA76A',   // Cor Secundária / Apoio (Âmbar Suave / Caramelo)
          text: '#2C221E',        // Tipografia Principal (Café Espresso)
          muted: '#70625B',       // Tipografia Secundária (Taupe Médio)
          success: '#5B8A62',     // Sucesso / Normal (Verde Sálvia)
          warning: '#DF9B42',     // Alerta / Atenção (Mostarda Pastel)
          danger: '#C24E48',      // Crítico / Ruptura (Tijolo Queimado)
        }
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(44, 34, 30, 0.04), 0 1px 4px -1px rgba(44, 34, 30, 0.02)',
        'soft-md': '0 6px 16px -4px rgba(44, 34, 30, 0.06), 0 2px 6px -2px rgba(44, 34, 30, 0.03)',
        'soft-lg': '0 12px 28px -6px rgba(44, 34, 30, 0.08), 0 4px 10px -3px rgba(44, 34, 30, 0.04)',
      }
    },
  },
  plugins: [],
}