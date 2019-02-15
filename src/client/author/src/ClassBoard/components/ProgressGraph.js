/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Progress } from 'antd';
import styled from 'styled-components';
import BarGraph from './BarGraph';

// eslint-disable-next-line no-trailing-spaces
export default class Graph extends Component {
  render() {
    const { testActivity } = this.props;
    const totalCount = testActivity.length;
    let submittedCount = 0;
    let presentCount = 0;
    testActivity.forEach(({ status, present }) => {
      if (status === 'submitted') {
        submittedCount += 1;
      }
      if (present) {
        presentCount += 1;
      }
    });
    const percentage = Math.round((submittedCount / totalCount) * 100);
    console.log(percentage);
    return (
      <StyledDiv>
        <div>
          <StyledProgress
            className="getProgress"
            strokeLinecap="square"
            type="circle"
            percent={percentage}
            width={150}
            strokeWidth={15}
            strokeColor="#00b0ff"
            format={percent => `${percent}%`}
          />
          <GraphText>
            <p>{submittedCount} out of {totalCount} Submitted</p>
            <p>({(totalCount - presentCount) || 0} Absent)</p>
          </GraphText>
        </div>
        <BarGraph testActivity={testActivity} />
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
