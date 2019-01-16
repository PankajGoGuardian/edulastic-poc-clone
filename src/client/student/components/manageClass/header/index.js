import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { Select } from 'antd';
import AssignmentSelectClass from '../../commonStyle/assignmentSelectClass';
import AssignmentTitle from '../../assignments/common/assignmentTitle';
import HeaderWrapper from '../../../headerWrapper';

const options = ['ARCHIVE(0)', 'ARCHIVE(1)', 'ARCHIVE(2)', 'ARCHIVE(3)'];
const { Option } = Select;

const AssignmentSelect = ({ t }) => (
  <AssignmentSelectClass>
    <ClassLabel>{t('common.showLabel')}</ClassLabel>
    <Select defaultValue="Question 1/10">
      {options.map((option, i) => (
        <Option key={i} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

const ManageClassHeader = ({ t }) => (
  <HeaderWrapper>
    <Wrapper>
      <AssignmentTitle>{t('common.manageClassTitle')}</AssignmentTitle>
      <AssignmentSelect t={t} />
    </Wrapper>
  </HeaderWrapper>
);

const enhance = compose(
  memo,
  withNamespaces('header')
);

AssignmentSelect.propTypes = {
  t: PropTypes.func.isRequired
};

ManageClassHeader.propTypes = {
  t: PropTypes.func.isRequired
};

export default enhance(ManageClassHeader);

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const ClassLabel = styled.span`
  display: flex;
  font-size: ${props => props.theme.headerClassTitleFontSize};
  color: ${props => props.theme.headerClassTitleColor};
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;
  @media (max-width: 768px) {
    width: 65px;
    width: auto;
    margin-right: 10px;
  }
`;
