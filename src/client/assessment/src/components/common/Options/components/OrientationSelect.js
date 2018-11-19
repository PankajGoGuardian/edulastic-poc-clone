import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import i18, { withNamespaces } from '@edulastic/localization';

import O from '../Options';

const options = [
  { value: 'horizontal', label: i18.t('assessment:component.options.horizontal') },
  { value: 'vertical', label: i18.t('assessment:component.options.vertical') },
];

const OrientationSelect = ({ t, onChange, value }) => (
  <Fragment>
    <O.Label>{t('component.options.orientation')}</O.Label>
    <Select size="large" value={value} style={{ width: '80%' }} onChange={onChange}>
      {options.map(({ value: val, label }) => (
        <Select.Option key={val} value={val}>
          {label}
        </Select.Option>
      ))}
    </Select>
  </Fragment>
);

OrientationSelect.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

OrientationSelect.defaultProps = {
  value: '',
};

export default withNamespaces('assessment')(OrientationSelect);
