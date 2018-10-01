import React from 'react';
import { translate as t } from '../utils/localization';

const Preloader = () => (
  <span>
    {t('components.preloader.loading')}
    ...
  </span>
);

export default Preloader;
