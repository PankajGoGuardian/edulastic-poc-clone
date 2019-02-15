import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';


export default class BarGraph extends Component {
  render() {
    const { testActivity } = this.props;
    const data = [];
    if (testActivity) {
      testActivity.forEach((item) => {
        data.push({
          name: item.studentName,
          red: (item.maxScore || 0) - (item.score || 0),
          green: item.score || 0,
          all: item.maxScore || 0
        });
      });
    }
    return (
      <MainDiv className="studentBarChart">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart
            barGap={1}
            barSize={36}
            data={data}
            margin={{ top: 20, right: 60, bottom: 0, left: 20 }}
          >
            <XAxis dataKey="name" axisLine={false} tickSize={0} />
            <YAxis
              dataKey="all"
              yAxisId={0}
              tickCount={4}
              allowDecimals={false}
              tick={{ strokeWidth: 0, fill: '#999' }}
              tickSize={6}
              label={{ value: 'ATTEMPTS', angle: -90, fill: '#999' }}
              stroke="#999"
            />
            <YAxis
              dataKey="all"
              yAxisId={1}
              tickCount={4}
              allowDecimals={false}
              tick={{ strokeWidth: 0, fill: '#999' }}
              tickSize={6}
              label={{ value: 'AVG TIME (SECONDS)', angle: -90, fill: '#999' }}
              orientation="right"
              stroke="#999"
            />
            <Bar stackId="a" dataKey="green" fill="#1fe3a0" />
            <Bar stackId="a" dataKey="red" fill="#ee1b82" />
          </ComposedChart>
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}

BarGraph.propTypes = {
  testActivity: PropTypes.array.isRequired
};

const MainDiv = styled.div`
  width:100%;
  .highcharts-credits{
    display: none;
  }
  .highcharts-title{
    display: none;
  }
`;
