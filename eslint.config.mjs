// @ts-check
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'worker-configuration.d.ts'] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  eslintConfigPrettier,
  {
    files: ['src/components/Carousel.astro'],
    rules: {
      // Focusable scroll container is the WAI "scrollable region" pattern (G202) —
      // lets keyboard users page through with arrow keys without a real widget role.
      'astro/jsx-a11y/no-noninteractive-tabindex': 'off',
    },
  },
];
