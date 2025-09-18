import type { Config } from 'postcss-load-config'

const config: Config = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  }
}

export default config
