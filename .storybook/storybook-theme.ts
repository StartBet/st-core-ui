import { create } from '@storybook/theming/create';

type StorybookThemeConfig = {
  brandImage?: string;
};

const storybookDarkThemeValues = {
  surface2: '#1a1326',
  surface3: '#0c0714',
  border1: 'rgba(216, 207, 236, 0.24)',
  contentDefault: '#f7f2ff',
  contentBright: '#ffffff',
  contentSecondary: '#acee68'
} as const;

export const createStorybookTheme = ({
  brandImage
}: StorybookThemeConfig = {}) =>
  create({
    base: 'dark',
    colorPrimary: storybookDarkThemeValues.contentSecondary,
    colorSecondary: storybookDarkThemeValues.contentSecondary,
    appBg: storybookDarkThemeValues.surface2,
    appContentBg: storybookDarkThemeValues.surface3,
    appPreviewBg: storybookDarkThemeValues.surface3,
    appBorderColor: storybookDarkThemeValues.border1,
    appBorderRadius: 8,
    textColor: storybookDarkThemeValues.contentDefault,
    textInverseColor: storybookDarkThemeValues.contentBright,
    barTextColor: storybookDarkThemeValues.contentDefault,
    barSelectedColor: storybookDarkThemeValues.contentSecondary,
    barHoverColor: storybookDarkThemeValues.contentSecondary,
    barBg: storybookDarkThemeValues.surface2,
    inputBg: storybookDarkThemeValues.surface3,
    inputBorder: storybookDarkThemeValues.border1,
    inputTextColor: storybookDarkThemeValues.contentDefault,
    inputBorderRadius: 8,
    brandTitle: 'Start Core UI',
    ...(brandImage ? { brandImage } : {})
  });
