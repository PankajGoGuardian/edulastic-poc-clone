import React from 'react';
import PropTypes from 'prop-types';
import { typedList as types, math } from '@edulastic/constants';
import { Row, Col, Select, Input, Checkbox } from 'antd';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';

import TypedList from '../../TypedList';
import Options from '../Options';
import NumberPad from '../../NumberPad';

import LeftIco from '../../../MathFormula/assets/images/numpads/left.svg';
import RightIco from '../../../MathFormula/assets/images/numpads/right.svg';
import DeleteIco from '../../../MathFormula/assets/images/numpads/delete.svg';

export const numberPadItems = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '\\div', label: '÷' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '\\times', label: '×' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '-', label: '-' },
  { value: '0', label: '0' },
  { value: '.', label: '.' },
  { value: ',', label: ',' },
  { value: '+', label: '+' },
  { value: 'left_move', label: <img src={LeftIco} width={10} alt="left" /> },
  { value: 'right_move', label: <img src={RightIco} width={10} alt="right" /> },
  { value: 'Backspace', label: <img src={DeleteIco} width={10} alt="delete" /> },
  { value: '=', label: '=' }
];

const KeyPadOptions = ({ t, onChange, item }) => {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...item.ui_style,
      [prop]: value
    });
  };

  const handleAddSymbol = () => {
    let data = [];

    if (item.symbols && item.symbols.length) {
      data = [...item.symbols];
    }
    onChange('symbols', [...data, '']);
  };

  const handleDeleteSymbol = (index) => {
    const data = [...item.symbols];
    data.splice(index, 1);
    onChange('symbols', data);
  };

  const handleSymbolsChange = (index, value) => {
    const data = [...item.symbols];

    if (value === 'custom') {
      data[index] = {
        label: 'label',
        title: '',
        value: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
      };
    } else {
      data[index] = value;
    }

    onChange('symbols', data);
  };

  const handleChangeNumberPad = (index, value) => {
    const numberPad = item.numberPad ? [...item.numberPad] : [];

    numberPad[index] = value;
    onChange('numberPad', numberPad);
  };

  const getNumberPad = () => {
    if (!item.numberPad || !item.numberPad.length) {
      onChange('numberPad', numberPadItems.map(({ value }) => value));
      return numberPadItems;
    }
    return item.numberPad.map((num) => {
      const res = numberPadItems.find(({ value }) => num === value);

      return res || { value: '', label: 'empty' };
    });
  };

  return (
    <Options.Block>
      <Options.Heading>{t('component.options.keypad')}</Options.Heading>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Checkbox
            checked={item.showHints}
            size="large"
            onChange={e => onChange('showHints', e.target.checked)}
          >
            Show keypad hints
          </Checkbox>
        </Col>
      </StyledRow>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Options.Label>{t('component.options.maximumLines')}</Options.Label>
          <Input
            size="large"
            type="number"
            value={item.ui_style.max_lines}
            onChange={e => changeUiStyle('max_lines', +e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Options.Label>{t('component.options.defaultMode')}</Options.Label>
          <Select
            size="large"
            value={item.ui_style.default_mode}
            style={{ width: '100%' }}
            onChange={val => changeUiStyle('default_mode', val)}
          >
            {math.modes.map(({ value: val, label }) => (
              <Select.Option key={val} value={val}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledRow>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Options.Label>{t('component.options.numberPad')}</Options.Label>
          <NumberPad onChange={handleChangeNumberPad} items={getNumberPad()} />
        </Col>
        <Col span={12}>
          <Options.Label>{t('component.options.symbols')}</Options.Label>
          <TypedList
            type={types.SELECT}
            selectData={[...math.symbols, { value: 'custom', label: 'Add custom group' }]}
            buttonText="Add"
            onAdd={handleAddSymbol}
            items={item.symbols}
            onRemove={handleDeleteSymbol}
            onChange={handleSymbolsChange}
          />
        </Col>
      </StyledRow>
    </Options.Block>
  );
};

KeyPadOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces('assessment')(KeyPadOptions);

const StyledRow = styled(Row)`
  margin-bottom: 25px;
`;
