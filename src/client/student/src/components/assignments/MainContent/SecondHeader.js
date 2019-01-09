import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import Breadcrumb from '../../Breadcrumb';

class SecondHeadbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIdx: 0,
      breadcrumbData: [{ title: 'ASSIGNMENTS', to: '' }]
    };
  }

  handlerButton = (index) => {
    this.setState({ buttonIdx: index });
  }

  render() {
    const { buttonIdx, breadcrumbData } = this.state;
    return (
      <Container>
        <div>
          <Breadcrumb data={breadcrumbData} />
        </div>
        <StatusBtnsContainer>
          <StyledButton
            onClick={() => this.handlerButton(0)}
            enabled={buttonIdx === 0 && true}
          >
            6 ALL
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(1)}
            enabled={buttonIdx === 1 && true}
          >
            1 NOT STARTED
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(2)}
            enabled={buttonIdx === 2 && true}
          >
            0 IN PROGRESS
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(3)}
            enabled={buttonIdx === 3 && true}
          >
            5 SUBMITTED
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(4)}
            enabled={buttonIdx === 4 && true}
          >
            0 GRADED
          </StyledButton>
        </StatusBtnsContainer>
      </Container>
    );
  }
}

export default SecondHeadbar;

const Container = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 40px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusBtnsContainer = styled.div`
  @media screen and (max-width: 768px) {
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: row;
    overflow: auto;
  }
`;

const StyledButton = styled(Button)`
  height: 24px;
  color: ${props => (props.enabled ? '#fff' : '#00b0ff')};
  border: 1px solid #00b0ff;
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  background: ${props => (props.enabled ? '#00b0ff' : 'transparent')};
  &:focus, &:active {
    color: ${props => (props.enabled ? '#fff' : '#00b0ff')};
    background: ${props => (props.enabled ? '#00b0ff' : 'transparent')};
  }
  span {
    font-size: 10px;
    font-weight: 600;
  }
  @media screen and (max-width: 768px) {
    margin:5px 10px 0px 0px;
    min-width: auto;
  }
`;
