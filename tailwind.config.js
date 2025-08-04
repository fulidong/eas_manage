const themes = require('./tailwind-theme')
module.exports = {
  purge: [],
  presets: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    ...themes
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'empty',
    'read-only',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled'
  ],
  corePlugins: {
    preflight: false // 禁用tailwindcss默认样式
  },
  plugins: []
}
