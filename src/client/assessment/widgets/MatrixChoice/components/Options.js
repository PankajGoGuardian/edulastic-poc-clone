import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import { withNamespaces } from '@edulastic/localization';

import WidgetOptions from '../../../containers/WidgetOptions';
import { Block } from '../../../styled/WidgetOptions/Block';
import { Heading } from '../../../styled/WidgetOptions/Heading';
import { Row } from '../../../styled/WidgetOptions/Row';
import { Col } from '../../../styled/WidgetOptions/Col';
import { Label } from '../../../styled/WidgetOptions/Label';
import FontSizeSelect from '../../../components/FontSizeSelect';

function Options({ onChange, uiStyle, t }) {
  const changeUiStyle = (prop, value) => {
    console.log(prop, value);
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value
    });
  };

  const styleOptions = [
    { value: 'inline', label: t('component.options.inline') },
    { value: 'table', label: t('component.options.table') }
  ];
  const stemNumerationOptions = [
    { value: 'number', label: t('component.options.numerical') },
    { value: 'upper-alpha', label: t('component.options.uppercase') },
    { value: 'lower-alpha', label: t('component.options.lowercase') }
  ];

  return (
    <WidgetOptions>
      <Block>
        <Heading>{t('component.options.layout')}</Heading>

        <Row>
          <Col md={6}>
            <Label>{t('component.matrix.matrixStyle')}</Label>
            <Select
              style={{ width: '80%' }}
              size="large"
              onChange={val => changeUiStyle('type', val)}
              value={uiStyle.type}
              data-cy="matrixStyle"
            >
              {styleOptions.map(option => (
                <Select.Option
                  data-cy={option.value}
                  key={option.value}
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          {uiStyle.type === 'table' && (
            <Col md={6}>
              <Label>{t('component.options.stemNumeration')}</Label>
              <Select
                style={{ width: '80%' }}
                size="large"
                onChange={val => changeUiStyle('stem_numeration', val)}
                value={uiStyle.stem_numeration}
                data-cy="stemNum"
              >
                {stemNumerationOptions.map(option => (
                  <Select.Option
                    data-cy={option.value}
                    key={option.value}
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>

        <Row>
          <Col md={6}>
            <FontSizeSelect
              onChange={val => changeUiStyle('fontsize', val)}
              value={uiStyle.fontsize}
            />
          </Col>
        </Row>
      </Block>
    </WidgetOptions>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired
};

Options.defaultProps = {
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 0,
    orientation: 'horizontal',
    choice_label: 'number'
  }
};

export default withNamespaces('assessment')(Options);
