import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import i18, { withNamespaces } from '@edulastic/localization';

import O from '../Options';

const options = [
  { value: 'small', label: i18.t('assessment:component.options.small') },
  { value: 'normal', label: i18.t('assessment:component.options.normal') },
  { value: 'large', label: i18.t('assessment:component.options.large') },
  { value: 'xlarge', label: i18.t('assessment:component.options.extraLarge') },
  { value: 'xxlarge', label: i18.t('assessment:component.options.huge') }
];

const FontSizeSelect = ({ t, onChange, value }) => (
  <Fragment>
    <O.Label>{t('component.options.fontSize')}</O.Label>
    <Select data-cy="fontSizeSelect" size="large" value={value} style={{ width: '80%' }} onChange={onChange}>
      {options.map(({ value: val, label }) => (
        <Select.Option data-cy={val} key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </Select>
  </Fragment>
);

FontSizeSelect.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any
};

FontSizeSelect.defaultProps = {
  value: 'normal'
};

export default withNamespaces('assessment')(FontSizeSelect);
