import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';
import NumberPad from '../NumberPad';
import { keyboardButtons } from '../../MathFormula/common/MathKeyboard/MathKeyboard';

const CustomGroup = ({ onChange, onRemove, value }) => {
  const handleChangeValue = (field, val) => {
    const newValue = cloneDeep(value);
    newValue[field] = val;
    onChange(newValue);
  };

  const makeCharacterMap = () =>
    [{ value: '', label: 'empty' }].concat(
      keyboardButtons.map(button => ({
        value: button.handler,
        label: button.label
      }))
    );

  const getNumberPad = () =>
    value.value.map((num) => {
      let res = keyboardButtons.find(({ handler }) => num === handler);

      if (res) {
        res = {
          value: res.handler,
          label: res.label
        };
      }

      return res || { value: '', label: 'empty' };
    });

  const handleChangeNumberPad = (index, val) => {
    const numberPad = value.value ? [...value.value] : [];

    numberPad[index] = val;
    handleChangeValue('value', numberPad);
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <div>Label</div>
          <Input
            style={{ width: '100%' }}
            onChange={e => handleChangeValue('label', e.target.value)}
            value={value.label}
            size="large"
          />
        </Col>
        <Col>
          <div>Title</div>
          <Input
            style={{ width: '100%' }}
            onChange={e => handleChangeValue('title', e.target.value)}
            value={value.title}
            size="large"
          />
        </Col>
        <IconTrash
          onClick={onRemove}
          color={greenDark}
          hoverColor={red}
          width={40}
          height={40}
          style={{ cursor: 'pointer' }}
        />
      </Row>
      <Row>
        <NumberPad
          onChange={handleChangeNumberPad}
          items={getNumberPad()}
          characterMapButtons={makeCharacterMap()}
        />
      </Row>
    </Fragment>
  );
};

CustomGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired
};

export default CustomGroup;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
  align-items: center;
`;

const Col = styled.div`
  margin-right: 15px;
  width: 100%;

  :last-child {
    margin-right: 0;
  }
`;
