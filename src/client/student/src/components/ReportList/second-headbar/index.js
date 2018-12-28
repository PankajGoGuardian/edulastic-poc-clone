import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Button, Icon } from 'antd';
import Breadcrumb from '../../../../../author/src/components/Breadcrumb';

const options = [
  'Question 1/10',
  'Question 2/10',
  'Question 3/10',
  'Question 4/10'
];
const { Option } = Select;

const breadcrumbData = [{ title: 'REPORTS', to: '/home/reports' }, { title: 'MATH CALCULATOR', to: '' }];

const ReportListSecondHeader = () => {
  const [btnIndex, setBtnIndex] = useState(0);
  const handlerNumberBtn = (index) => {
    setBtnIndex(index);
  };
  return (
    <Container>
      <BreadcrumbContainer>
        <Breadcrumb data={breadcrumbData} />
      </BreadcrumbContainer>
      <QuestionSelect>
        <Select defaultValue="Question 1/10">
          {options.map((option, index) => (
            <Option key={index}> {option} </Option>
          ))}
        </Select>
        <ButtonContainer>
          <StyledButton>
            <Icon type="left" />
          </StyledButton>
          {
            options.map((option, index) => (
              <StyledNumberButton
                enabled={btnIndex === index}
                onClick={() => handlerNumberBtn(index)}
              >
                {index + 1}
              </StyledNumberButton>
            ))
          }
          <StyledButton>
            <Icon type="right" />
          </StyledButton>
        </ButtonContainer>
      </QuestionSelect>
    </Container>
  );
};

export default ReportListSecondHeader;

const Container = styled.div`
  padding: 20px 40px 0px 40px;
  display: flex;
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
`;

const QuestionSelect = styled.div`
  display: flex;
  height: 35px;
  justify-content: space-between;

  .ant-select {
    width: 145px;
  }
  .ant-select-selection {
    display: flex;
    align-items: center;
  }
  .ant-select-selection__rendered {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }
  .anticon-down {
    svg {
      fill: #00b0ff;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const StyledNumberButton = styled(Button)`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  background: ${props => (props.enabled ? '#00b0ff' : '#fff')};
  color: ${props => (props.enabled ? '#fff' : '#4d4f5c')};
  &:hover, &:focus {
    background: #00b0ff;
    color: #fff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 15px;
`;
