import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { white } from '@edulastic/colors';
import { IconCursor, IconInRuler, IconCalculator, IconClose, IconProtactor } from '@edulastic/icons';

class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 0
    };
  }

  toolbarHandler = (value) => {
    this.setState({ select: value });
  }

  render() {
    const { select } = this.state;
    return (
      <Container>
        <StyledButton
          enable={select === 0 && true}
          onClick={() => this.toolbarHandler(0)}
        >
          <CursorIcon />
        </StyledButton>

        <StyledButton
          enable={select === 1 && true}
          onClick={() => this.toolbarHandler(1)}
        >
          <InRulerIcon />
        </StyledButton>

        <StyledButton
          enable={select === 2 && true}
          onClick={() => this.toolbarHandler(2)}
        >
          <CaculatorIcon />
        </StyledButton>

        <StyledButton
          enable={select === 3 && true}
          onClick={() => this.toolbarHandler(3)}
        >
          <CloseIcon />
        </StyledButton>

        <StyledButton
          enable={select === 4 && true}
          onClick={() => this.toolbarHandler(4)}
        >
          <ProtactorIcon />
        </StyledButton>
      </Container>
    );
  }
}

export default ToolBar;

const Container = styled.div`
  margin-left: 60px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: ${props => (props.enable ? '#00b0ff' : 'transparent')};
  height: 40px;
  width: 40px;

  &:focus, &:hover {
    background: ${props => (props.enable ? '#00b0ff' : 'transparent')};
  }
`;

const CursorIcon = styled(IconCursor)`
  fill: ${white};
  margin-left: -2px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const InRulerIcon = styled(IconInRuler)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const CaculatorIcon = styled(IconCalculator)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const CloseIcon = styled(IconClose)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const ProtactorIcon = styled(IconProtactor)`
  fill: ${white};
  margin-left: -2px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;
