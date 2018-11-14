import React from 'react';
import { Select } from '@edulastic/common';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import O from '../../common/Options';

function Options({ onChange, uiStyle, t, outerStyle }) {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value,
    });
  };

  return (
    <O outerStyle={outerStyle}>
      <O.Block>
        <O.Heading>{t('component.options.layout')}</O.Heading>
        <O.Row>
          <O.Col md={6}>
            <O.Label>{t('component.options.responsecontainerposition')}</O.Label>
            <Select
              style={{ width: '80%' }}
              onChange={val => changeUiStyle('responsecontainerposition', val)}
              options={[
                { value: 'top', label: t('component.options.top') },
                { value: 'bottom', label: t('component.options.bottom') },
                { value: 'right', label: t('component.options.right') },
                { value: 'left', label: t('component.options.left') },
              ]}
              value={uiStyle.responsecontainerposition}
            />
          </O.Col>
          <O.Col md={6}>
            <O.Label>{t('component.options.stemnumeration')}</O.Label>
            <Select
              style={{ width: '80%' }}
              onChange={val => changeUiStyle('stemnumeration', val)}
              options={[
                { value: 'numerical', label: t('component.options.numerical') },
                { value: 'uppercase', label: t('component.options.uppercasealphabet') },
                { value: 'lowercase', label: t('component.options.lowercasealphabet') },
              ]}
              value={uiStyle.stemnumeration}
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
      </O.Block>
    </O>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  outerStyle: PropTypes.object,
};

Options.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemnumeration: '',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: [],
  },
};

export default withNamespaces('assessment')(Options);
