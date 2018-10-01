import React from 'react';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';

const Preloader = ({ t }) => (
  <span>
    {t('preloader.loading')}
    ...
  </span>
);

Preloader.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces('common')(Preloader);
