/* eslint-disable no-undef */
import React, { Component } from 'react';
import styled from 'styled-components';

const Highcharts = require('react-highcharts');

export default class BarGraph extends Component {
    config = {
      chart: {
        height: '240px',
        width: 1000
      },
      legend: {
        enabled: false
      },
      xAxis: [{
        categories: ['Q1', 'Q1', 'Q1', 'Q1', 'Q1'],
        alignTicks: false,
        allowDecimals: false
      }],
      yAxis: [{
        allowDecimals: false,
        alignTicks: false,
        categories: ['0', '5', '10'],
        // Primary yAxis

        title: {
          text: 'ATTEMPTS'
        },
      }, { // Secondary yAxis
        title: {
          text: 'AVG TIME (SECONDS)'
        },
        labels: {
          format: '{value}'
        },
        opposite: true
      }],
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [{
        type: 'column',
        color: '#ee1b82',
        data: [5, 5, 5, 5, 5, 5]
      }, {
        type: 'column',
        color: '#fdcc3a',
        data: [5, 5, 5, 5, 5, 5]
      }, {
        type: 'column',
        color: '#1fe3a0',
        data: [10, 15, 25, 30, 32, 50]
      }, {
        type: 'line',
        color: '#1baae9',
        data: [7, 12, 20, 24, 25, 40],
        yAxis: 1
      }]
    };

    render() {
      return (
        <MainDiv>
          <StyledDiv config={this.config} />
        </MainDiv>
      );
    }
}

const StyledDiv = styled(Highcharts)`
       
`;

const MainDiv = styled.div`
       width:100%;
`;
