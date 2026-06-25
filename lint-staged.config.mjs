export default {
  '*.{js,cjs,mjs,ts,cts,mts,tsx,vue}': [
    'eslint --fix',
    'prettier --write',
    () => 'npm run test:run'
  ],
  '*.{json,md,yml,yaml,mjs,css}': ['prettier --write']
};
