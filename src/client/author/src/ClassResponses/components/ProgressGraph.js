/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Progress } from 'antd';
import styled from 'styled-components';
import BarGraph from './BarGraph';

// eslint-disable-next-line no-trailing-spaces
export default class Graph extends Component {
  render() {
    return (
      <StyledDiv>
        <div>
          <StyledProgress className="getProgress" strokeLinecap="square" type="circle" percent={80} width={150} strokeWidth={15} strokeColor="#00b0ff" />
          <GraphText>
            <p>14 out of 26 Submitted</p>
            <p>(12 Absent)</p>
          </GraphText>
        </div>
        <BarGraph />
      </StyledDiv>
    );
  }
}

const StyledProgress = styled(Progress)`
  margin:10px 30px;
`;

const StyledDiv = styled.div`
  display:flex;
`;

const GraphText = styled.div`
  text-align:center;
  font-weight:bold;
  font-size:1em;
`;
