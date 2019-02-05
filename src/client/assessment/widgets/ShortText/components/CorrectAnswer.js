import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Row, Col } from 'antd';

import { secondaryTextColor } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

import { Subtitle } from '../../../styled/Subtitle';

const CorrectAnswer = ({ t, onSelectChange, onChange, options, selectValue, inputValue }) => (
  <Row>
    <Col span={12}>
      <Subtitle fontSize={13} padding="0 0 16px 0" color={secondaryTextColor}>
        {t('component.shortText.selectLabel')}
      </Subtitle>
      <Select size="large" style={{ width: '100%' }} value={selectValue} onChange={onSelectChange}>
        {options.map((item, i) => (
          <Select.Option key={i} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>

      <Subtitle fontSize={13} padding="20px 0 16px 0" color={secondaryTextColor}>
        {t('component.shortText.inputLabel')}
      </Subtitle>
      <Input size="large" value={inputValue} onChange={e => onChange(e.target.value)} />
    </Col>
  </Row>
);

CorrectAnswer.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(CorrectAnswer);
