import { create } from '@storybook/theming/create';

type StorybookThemeConfig = {
  brandImage?: string;
};

export const storybookThemeItems = [
  { value: 'dark', title: 'Dark' },
  { value: 'light', title: 'Light' }
] as const;

export type StorybookThemeMode = (typeof storybookThemeItems)[number]['value'];

type StorybookPalette = {
  surface2: string;
  surface3: string;
  border1: string;
  contentDefault: string;
  contentBright: string;
  contentSecondary: string;
};

export const storybookPalettes: Record<StorybookThemeMode, StorybookPalette> = {
  dark: {
    surface2: '#270644',
    surface3: '#1d0533',
    border1: 'rgba(180, 124, 255, 0.48)',
    contentDefault: '#f5f5f5',
    contentBright: '#ffffff',
    contentSecondary: '#acee68'
  },
  light: {
    surface2: '#e0d9fb',
    surface3: '#d7cff8',
    border1: 'rgba(30, 5, 52, 0.4)',
    contentDefault: '#262626',
    contentBright: '#ffffff',
    contentSecondary: '#3f7d10'
  }
};

export const createStorybookTheme = (
  mode: StorybookThemeMode = 'dark',
  { brandImage }: StorybookThemeConfig = {}
) => {
  const palette = storybookPalettes[mode];

  return create({
    base: 'dark',
    colorPrimary: palette.contentSecondary,
    colorSecondary: palette.contentSecondary,
    appBg: palette.surface2,
    appContentBg: palette.surface3,
    appPreviewBg: palette.surface3,
    appBorderColor: palette.border1,
    appBorderRadius: 8,
    textColor: palette.contentDefault,
    textInverseColor: palette.contentBright,
    barTextColor: palette.contentDefault,
    barSelectedColor: palette.contentSecondary,
    barHoverColor: palette.contentSecondary,
    barBg: palette.surface2,
    inputBg: palette.surface3,
    inputBorder: palette.border1,
    inputTextColor: palette.contentDefault,
    inputBorderRadius: 8,
    brandTitle: 'Start Core UI',
    ...(brandImage ? { brandImage } : {})
  });
};
