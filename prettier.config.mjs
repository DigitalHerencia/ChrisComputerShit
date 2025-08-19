/** @type {import('prettier').Config} */
export default {
  semi: true,
  singleQuote: false,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: [
    require.resolve('prettier-plugin-tailwindcss'),
    require.resolve('prettier-plugin-organize-imports'),
    ],
};