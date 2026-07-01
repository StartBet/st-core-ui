import { addons } from '@storybook/manager-api';
import brandImage from './start-core-ui.png';
import { createStorybookTheme } from './storybook-theme';

import './manager.css';
import '../src/css/tokens.css';

addons.setConfig({
  theme: createStorybookTheme('dark', { brandImage })
});
