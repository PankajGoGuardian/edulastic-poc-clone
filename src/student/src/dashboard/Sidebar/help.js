import React from 'react';
import styled from 'styled-components';
import { IconQuestion } from '@edulastic/icons';

class Help extends React.Component {
  render() {
    return (
      <HelpWrapper>
        <HelpCenter>
          <HelpIconWrapper>
            <HelpIcon />
          </HelpIconWrapper>
          <HelpText>Help Center</HelpText>
        </HelpCenter>
        <HelpCenter>Help Center1</HelpCenter>
      </HelpWrapper>
    );
  }
}

export default Help;

const HelpWrapper = styled.div`
  position: absolute;
  bottom: 25px;
`;
const HelpCenter = styled.div`
  padding: 1.3rem 2.8rem;
  border-radius: 2rem;
  background-color: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 0.2rem 0.5rem;
  &:hover {
    background: #1fe3a1;
  }
`;

const HelpIconWrapper = styled.span`
  padding-right: 1rem;
`;

const HelpIcon = styled(IconQuestion)`
  fill: #1fe3a1;
`;

const HelpText = styled.span`
  color: #7a7a7a;
  font-size: 1rem;
  font-weight: 600;
`;
