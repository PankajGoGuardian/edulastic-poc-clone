import React from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Col } from 'antd';
import { EduButton, FlexContainer } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';

import Options from '../../../common/Options';

const thousandsSeparators = [
  { value: ',', label: 'Comma' },
  { value: '.', label: 'Dot' },
  { value: ' ', label: 'Space' }
];

const ThousandsSeparators = ({ separators, onChange, onAdd, onDelete }) => (
  <Col span={12}>
    <Options.Label>Thousands separator</Options.Label>
    {separators &&
      !!separators.length &&
      separators.map((separator, i) => (
        <Row key={i} style={{ marginBottom: 15 }}>
          <Col span={24}>
            <FlexContainer>
              <Select
                size="large"
                value={separator}
                style={{ width: '100%' }}
                onChange={val => onChange({ val, index: i })}
              >
                {thousandsSeparators.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              <IconTrash
                style={{ cursor: 'pointer' }}
                width={22}
                height={22}
                color={greenDark}
                hoverColor={red}
                onClick={() => onDelete(i)}
              />
            </FlexContainer>
          </Col>
        </Row>
      ))}
    <EduButton onClick={onAdd} size="small" type="primary">
      Add
    </EduButton>
  </Col>
);

ThousandsSeparators.propTypes = {
  separators: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

ThousandsSeparators.defaultProps = {
  separators: []
};

export default ThousandsSeparators;
