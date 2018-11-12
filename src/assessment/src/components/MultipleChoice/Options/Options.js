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
                { value: 'standard', label: t('component.options.standard') },
                { value: 'block', label: t('component.options.block') },
                { value: 'radioBelow', label: t('component.options.radioButtonBelow') },
              ]}
              value={uiStyle.type}
            />
          </O.Col>
          <O.Col md={6}>
            <O.Label>{t('component.options.columns')}</O.Label>
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
                { value: 'horizontal', label: t('component.options.horizontal') },
                { value: 'vertical', label: t('component.options.vertical') },
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
                { value: 'small', label: t('component.options.small') },
                { value: 'normal', label: t('component.options.normal') },
                { value: 'large', label: t('component.options.large') },
                { value: 'xlarge', label: t('component.options.extraLarge') },
                { value: 'xxlarge', label: t('component.options.huge') },
              ]}
              value={uiStyle.fontsize}
            />
          </O.Col>
        </O.Row>

        {uiStyle.type === 'block' && (
          <O.Row>
            <O.Col md={6}>
              <O.Label>{t('component.options.labelType')}</O.Label>
              <Select
                style={{ width: '80%' }}
                onChange={val => changeUiStyle('choice_label', val)}
                options={[
                  { value: 'number', label: t('component.options.numerical') },
                  { value: 'upper-alpha', label: t('component.options.uppercase') },
                  { value: 'lower-alpha', label: t('component.options.lowercase') },
                ]}
                value={uiStyle.choice_label}
              />
            </O.Col>
          </O.Row>
        )}
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
    choice_label: 'number',
  },
};

export default withNamespaces('assessment')(Options);
