/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import {
  withWindowSizes,
  FlexContainer
} from '@edulastic/common';
import { Link } from 'react-router-dom';
import { Card, Checkbox, Button } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import { receiveGradeBookdAction, receiveTestActivitydAction } from '../../actions/classBoard';
import {
  getGradeBookSelector,
  getTestActivitySelector
} from '../../selectors/classBoard';
import ListHeader from './ListHeader';
import SortBar from './SortBar';
import AnswerCard from './AnswerCard';

const Highcharts = require('react-highcharts');

class ClassResponses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: '',
      blockStyle: 'tile',
      isShowFilter: false,
    };
  }
  componentDidMount() {
    const { loadGradebook, loadTestActivity , match} = this.props;
    const { assignmentId, classId } = match.params;
    loadGradebook(assignmentId,classId);
    loadTestActivity(assignmentId,classId)
  }

  handleCreate = () => {
    // eslint-disable-next-line react/prop-types
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

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
        data: []
      }, {
        type: 'column',
        color: '#fdcc3a',
        data: []
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
      height = document.getElementsByClassName('ClassResponsesBarChart')[0].clientHeight
       width = document.getElementsByClassName('ClassResponsesBarChart')[0].clientWidth

      $("#container").highcharts().setSize(width, height, doAnimation = true);

      };
    const {
      // eslint-disable-next-line react/prop-types
      creating
    } = this.props;
    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
        />
        <StyledFlexContainer
          justifyContent="space-between"
        >
          <PaginationInfo>
            <a>&lt; <Link to="/author/assignments">RECENTS ASSIGNMENTS</Link></a> / <a>CALIFORNIA VERSION 4</a> / <a>CLASS 1</a>
          </PaginationInfo>
          <SortBar />
        </StyledFlexContainer>
        <StyledCard bordered={false}>
          <StyledGraphDivOne className="ClassResponsesBarChart">
            <StyledDiv config={config} />
          </StyledGraphDivOne>
          <StyledGraphDiv>
            <Paras>
              <ParaOne>TOTAL SCORE</ParaOne>
              <ParaTwo>12</ParaTwo>
              <ParaThree />
              <ParaFour>12</ParaFour>
            </Paras>
            <ParaT>
              <Pone><Color>Time:</Color> 1:54</Pone>
              <Pone><Color>Status:</Color> Graded</Pone>
              <Pone><Color>Submitted on:</Color> 19 October,2018</Pone>
              <Pone><Color>Hour:</Color> 03:13</Pone>
            </ParaT>
          </StyledGraphDiv>

        </StyledCard>
        <StyledFlexContainer
          justifyContent="space-between"
        >
          <PaginationInfoF>
            <StyledButtonA>6 ALL</StyledButtonA>
            <StyledButton>6 NOT STARTED</StyledButton>
            <StyledButton>0 IN PROGRESS</StyledButton>
            <StyledButton>0 SUBMITTED</StyledButton>
            <StyledButton>0 GRADED</StyledButton>
          </PaginationInfoF>
          <PaginationInfoS>
            <StyledButtonW>OVERALL FEEDBACK</StyledButtonW>
          </PaginationInfoS>
        </StyledFlexContainer>
        <AnswerCard />

      </div>
    );
  }
}
const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect(
    state => ({
      gradebook: getGradeBookSelector(state),
      testActivity: getTestActivitySelector(state),
    }),
    {
      loadGradebook: receiveGradeBookdAction,
      loadTestActivity: receiveTestActivitydAction
    }
  )
);

export default enhance(ClassResponses);

ClassResponses.propTypes = {
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired
};
const PaginationInfo = styled.span`
  font-weight: bold;
  font-size: 10px;
  word-spacing:5px;
  display:inline-block
  margin-left:30px;
  color:#1890ffd9;
`;
const ParaT = styled.p`
  margin-top:20px;
`;
const Color = styled.span`
 color:#58b294;
`;
const Pone = styled.p`
  font-size:0.9em;
  font-weight:bold;
  padding-left:20px;
`;
const Paras = styled.p`
  text-align:center;
  margin-top:20px;
`;
const ParaOne = styled.p`
  color:#C0C0C0;
  font-size:0.8em;
`;
const ParaTwo = styled.p`
  font-weight:bold;
  font-size:2em;
`;
const ParaThree = styled.p`
  width:40px;
  height:2px;
  background-color:#59595a;
  margin:auto;
`;
const ParaFour = styled.p`
font-weight:bold;
font-size:2em;
`;
const PaginationInfoF = styled.span`
  font-weight: bold;
  font-size: 15px;
  display:inline-block;
  margin-left:30px;
`;
const StyledGraphDiv = styled.div`
  display:inline-block;
  width:20%;
  height:200px;
  position:absolute;
  `;
const StyledGraphDivOne = styled.div`
  display:inline-block;
  width:75%;
  .highcharts-title{
    display: none;
  }
  .highcharts-credits{
    display: none;
  }
`;
const PaginationInfoS = styled.span`
  display:inline-block;
  `;
const StyledFlexContainer = styled(FlexContainer)`
  margin:20px 13px;
`;
const StyledCard = styled(Card)`
  margin:auto;
  width:95%;
  display:flex:
  justify-content:spance-between;
  height:270px;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
`;
const StyledButton = styled(Button)`
  font-size:0.64em;
  background-color:transparent;
  margin:0px 23px 0px -5px;
  width:100px;
  padding:2px 5px;
  height:25px;
  color:#00b0ff;
  border:1px solid #00b0ff;
  font-weight:bold;
`;
const StyledButtonW = styled(Button)`
  font-size:0.8em;
  background-color:white;
  margin:0px 23px 0px -5px;
  width:170px;
  padding:2px 5px;
  height:40px;
  color:#00b0ff;
  border:1px solid white;
  font-weight:bold;
`;
const StyledButtonA = styled(Button)`
  font-size:0.65em;
  margin:0px 23px 0px -5px;
  width:100px;
  padding:2px 5px;
  height:25px;
  color:white;
  background-color:#00b0ff;
  font-weight:bold;
`;
const StyledDiv = styled(Highcharts)`

`;
