/* eslint-disable no-undef */
import React, { Component } from 'react';
import styled from 'styled-components';

const Highcharts = require('react-highcharts');

export default class BarGraph extends Component {
  render() {
    let itemsSum = this.props.gradebook.itemsSummary;
    let categories = [];
    let greenData = [];
    let yellowData = [];
    let redData = [];
    if(itemsSum){
      itemsSum.map((item, index) => {
        categories.push("Q"+index);
        redData.push(item.wrongNum);
        yellowData.push(item.correctNum);
        greenData.push(item.partialNum);
      });
    }

    const config = {
      chart: {
        height: 240,
        // width: 500
      },
      legend: {
        enabled: false
      },
      xAxis: [{
        categories: categories,
        alignTicks: false,
        allowDecimals: false
      }],
      yAxis: [{
        allowDecimals: false,
        alignTicks: false,
        gridLineColor: 'white',
        categories: ['0', '1', '2'],
        title: {
          text: 'ATTEMPTS'
        },
      }, {
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
        data: redData
      }, {
        type: 'column',
        color: '#fdcc3a',
        data: yellowData
      }, {
        type: 'column',
        color: '#1fe3a0',
        data: greenData
      }, {
        type: 'line',
        color: '#1baae9',
        data: greenData,

      }]
    };

    window.onresize = function(event) {
      height = document.getElementsByClassName('studentBarChart')[0].clientHeight
      width = document.getElementsByClassName('studentBarChart')[0].clientWidth
      $("#container").highcharts().setSize(width, height, doAnimation = true);
    };
    return (
      <MainDiv className='studentBarChart'>
        <StyledDiv config={config} />
      </MainDiv>
    );
  }
}

const StyledDiv = styled(Highcharts)`

`;

const MainDiv = styled.div`
  width:100%;
  .highcharts-credits{
    display: none;
  }
  .highcharts-title{
    display: none;
  }
`;
