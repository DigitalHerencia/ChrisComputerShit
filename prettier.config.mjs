import tailwind from 'prettier-plugin-tailwindcss';

/** @type {import('prettier').Config} */
export default {
  semi: true,
  singleQuote: false,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: [tailwind]
};
