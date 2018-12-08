import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Col, Row } from 'antd';

import { withNamespaces } from '@edulastic/localization';
import { secondaryTextColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';

import styled from 'styled-components';
import Subtitle from './Subtitle';
import { ON_LIMIT, ALWAYS, OFF } from '../../constants/constantsForQuestions';

const options = [
  { value: ON_LIMIT, label: 'On limit' },
  { value: ALWAYS, label: 'Always visible' },
  { value: OFF, label: 'Off' }
];

const { Option } = Select;

const WordLimitAndCount = ({ onChange, selectValue, inputValue, t, withOutTopMargin }) => (
  <Fragment>
    <Subtitle padding={withOutTopMargin ? '0px 0 16px 0' : ''}>
      {t('component.essayPlainText.scoring')}
    </Subtitle>
    <Row gutter={70}>
      <Col span={12}>
        <LabelText>{t('component.essayPlainText.wordsLimitTitle')}</LabelText>
        <Select
          style={{ width: '100%', marginTop: 10 }}
          size="large"
          value={selectValue}
          onChange={val => onChange('show_word_limit', val)}
        >
          {options.map((item, i) => {
            const { label, value } = item;
            return (
              <Option key={i} value={value}>
                {label}
              </Option>
            );
          })}
        </Select>
      </Col>
      <Col span={12}>
        <FlexContainer style={{ marginTop: 31 }}>
          <Input
            size="large"
            style={{ width: 120 }}
            value={inputValue}
            onChange={e => onChange('max_word', e.target.value)}
          />
          <LabelText>{t('component.essayPlainText.wordsLimitTitle')}</LabelText>
        </FlexContainer>
      </Col>
    </Row>
  </Fragment>
);

WordLimitAndCount.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  inputValue: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  withOutTopMargin: PropTypes.bool
};

WordLimitAndCount.defaultProps = {
  withOutTopMargin: false
};

export default withNamespaces('assessment')(WordLimitAndCount);

const LabelText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${secondaryTextColor};
`;
