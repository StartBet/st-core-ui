const quoteFiles = (files) =>
  files
    .map((file) => {
      const escapedFile = file.replaceAll('"', String.raw`\\"`);
      return `"${escapedFile}"`;
    })
    .join(' ');

export default {
  '*.{js,cjs,mjs,ts,cts,mts,tsx,vue}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const quotedFiles = quoteFiles(files);

    return [
      `eslint --fix ${quotedFiles}`,
      `prettier --write ${quotedFiles}`,
      'npm run test:run'
    ];
  },
  '*.{json,md,yml,yaml,mjs,css}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const quotedFiles = quoteFiles(files);
    return [`prettier --write ${quotedFiles}`];
  }
};
