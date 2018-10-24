import React from 'react';
import { Select, TextField } from '@edulastic/common';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import O from '../../common/Options';

function Options({ onChange, uiStyle, t }) {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value,
    });
  };

  return (
    <O>
      <O.Block>
        <O.Heading>{t('component.options.layout')}</O.Heading>

        <O.Row>
          <O.Col md={6}>
            <O.Label>{t('component.options.style')}</O.Label>
            <Select
              style={{ width: '80%' }}
              onChange={val => changeUiStyle('type', val)}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'block', label: 'Block' },
                { value: 'radio', label: 'Radio Button Below' },
              ]}
              value={uiStyle.type}
            />
          </O.Col>
          <O.Col md={6}>
            <O.Label>{t('component.options.style')}</O.Label>
            <TextField
              type="number"
              disabled={false}
              containerStyle={{ width: 120 }}
              onChange={e => changeUiStyle('columns', +e.target.value)}
              value={uiStyle.columns}
            />
          </O.Col>
        </O.Row>

        <O.Row>
          <O.Col md={6}>
            <O.Label>{t('component.options.orientation')}</O.Label>
            <Select
              style={{ width: '80%' }}
              onChange={val => changeUiStyle('orientation', val)}
              options={[
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
              ]}
              value={uiStyle.orientation}
            />
          </O.Col>
          <O.Col md={6}>
            <O.Label>{t('component.options.fontSize')}</O.Label>
            <Select
              style={{ width: '80%' }}
              onChange={fontsize => changeUiStyle('fontsize', fontsize)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'normal', label: 'Normal' },
                { value: 'large', label: 'Large' },
                { value: 'xlarge', label: 'Extra Large' },
                { value: 'xxlarge', label: 'Huge' },
              ]}
              value={uiStyle.fontsize}
            />
          </O.Col>
        </O.Row>
      </O.Block>
    </O>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
};

Options.defaultProps = {
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 0,
    orientation: 'horizontal',
  },
};

export default withNamespaces('assessment')(Options);
