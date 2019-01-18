import React from 'react';
import styled from 'styled-components';
import { Col } from 'antd';

import HeaderWrapper from '../../../headerWrapper';
import QuestionSelect from '../../../src/components/ReportList/QuestionSelect';

const ReportListHeader = () => (
  <HeaderWrapper>
    <Container>
      <Title>Reports</Title>
      <QuestionSelectMobile>
        <QuestionSelect />
      </QuestionSelectMobile>
    </Container>
  </HeaderWrapper>
);

export default ReportListHeader;

const Container = styled.div``;
const QuestionSelectMobile = styled(Col)`
  display:none;
  @media (max-width:768px){
    display:flex;
    margin-top: 12px;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.headerTitleTextColor};
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  margin: 0;
  padding: 0;
  @media (max-width:768px){
    padding-left: 40px;
  }
`;
