import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MainDiv } from './styled'

export default class BarGraph extends Component {
  render() {
    const itemsSum = this.props.gradebook.itemsSummary;
    let data = [];
    if (itemsSum) {
      itemsSum.map((item, index) => {
        data.push({
          name: `Q${index+1}`,
          red: item.wrongNum || 0,
          yellow: item.correctNum || 0,
          green: item.partialNum || 0,
          all: (item.wrongNum || 0) + (item.correctNum || 0) + (item.partialNum || 0),
        })
      });
    }
    return (
      <MainDiv className="studentBarChart">
        <ResponsiveContainer width='100%' height={240} >
          <ComposedChart barGap={1} barSize={36} data={data} margin={{ top: 20, right: 60, bottom: 0, left: 20 }}>
            <XAxis dataKey="name" axisLine={false} tickSize={0}/>
            <YAxis
              dataKey="all"
              yAxisId={0}
              tickCount={4}
              allowDecimals={false}
              tick={{strokeWidth: 0, fill: '#999'}}
              tickSize={6}
              label={{ value: 'ATTEMPTS', angle: -90, fill: '#999'}}
              stroke="#999"
            />
            <YAxis
              dataKey="all"
              yAxisId={1}
              tickCount={4}
              allowDecimals={false}
              tick={{strokeWidth: 0, fill: '#999'}}
              tickSize={6}
              label={{ value: 'AVG TIME (SECONDS)', angle: -90, fill: '#999'}}
              orientation="right"
              stroke="#999"
            />
            <Bar stackId="a" dataKey="green" fill="#1fe3a0" />
            <Bar stackId="a" dataKey="yellow" fill="#fdcc3a" />
            <Bar stackId="a" dataKey="red" fill="#ee1b82" />
            <Line type='monotone' dataKey='green' stroke='#1baae9' dot={{ stroke: '#1baae9', strokeWidth: 2, fill: '#1baae9' }}/>
          </ComposedChart>
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}
