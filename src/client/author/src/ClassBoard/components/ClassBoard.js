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
} from '../ducks';
import ListHeader from './ListHeader';
import SortBar from './SortBar';
import DisneyCard from './DisneyCard';
import Ghat from '../../assets/assignments/graduation-hat.svg';
import Stats from '../../assets/assignments/stats.svg';
import Ptools from '../../assets/assignments/printing-tool.svg';
import More from '../../assets/assignments/more.svg';
import Elinks from '../../assets/assignments/external-link.svg';
import Graph from './ProgressGraph';
import Score from './Score';

class ClassBoard extends Component {
  constructor(props) {
    super(props);
    this.changeStateTrue = this.changeStateTrue.bind(this);
    this.changeStateFalse = this.changeStateFalse.bind(this);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      searchStr: '',
      // eslint-disable-next-line react/no-unused-state
      blockStyle: 'tile',
      // eslint-disable-next-line react/no-unused-state
      isShowFilter: false,
      flag: true
    };
  }

  componentDidMount() {
    const { loadGradebook, loadTestActivity, match } = this.props;
    const { assignmentId, classId } = match.params;
    loadGradebook(assignmentId, classId);
    loadTestActivity(assignmentId, classId);
  }

  changeStateTrue() {
    this.setState({
      flag: true
    });
  }

  changeStateFalse() {
    this.setState({
      flag: false
    });
  }

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  render() {
    const {
      gradebook,
      testActivity,
      creating,
      match
    } = this.props;
    const { assignmentId, classId } = match.params;
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
            &lt; <Link to="/author/assignments">RECENTS ASSIGNMENTS</Link> / <a>CALIFORNIA VERSION 4</a> / <a>CLASS 1</a>
          </PaginationInfo>
          <SortBar />
        </StyledFlexContainer>
        <StyledCard bordered={false}>
          <Graph gradebook={gradebook} />
        </StyledCard>
        <StyledFlexContainer
          justifyContent="space-between"
        >
          <PaginationInfoF>
            <StyledAnc
              onClick={this.changeStateTrue}
            ><img src={Ghat} />
            </StyledAnc>
            <SpaceDiv />
            <StyledAnc
              onClick={this.changeStateFalse}
            ><img src={Stats} />
            </StyledAnc>
            <SpaceDiv />
            <BarDiv />
            <SpaceDiv />
            <StyledCheckbox checked>SELECT ALL</StyledCheckbox>
          </PaginationInfoF>
          <PaginationInfoS>
            <StyledButton><img src={Ptools} /><SpaceDivF />PRINT</StyledButton>
            <StyledButton><img src={Elinks} /><SpaceDivF />REDIRECT</StyledButton>
            <StyledButton><img src={More} /><SpaceDivF />MORE</StyledButton>
          </PaginationInfoS>
        </StyledFlexContainer>
        {this.state.flag ?
          <DisneyCard testActivity={testActivity} assignmentId={assignmentId} classId={classId} /> :
          <Score />
        }
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

export default enhance(ClassBoard);

ClassBoard.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loadGradebook: PropTypes.func.isRequired,
  loadTestActivity: PropTypes.func.isRequired,
  gradebook: PropTypes.func.isRequired,
  creating: PropTypes.object.isRequired,
  testActivity: PropTypes.object.isRequired
};

const PaginationInfo = styled.span`
  font-weight: bold;
  font-size: 10px;
  word-spacing:5px;
  display:inline-block
  margin-left:30px;
  color:#1890ffd9;
`;
const PaginationInfoF = styled.span`
  font-weight: bold;
  font-size: 15px;
  display:inline-block;
  margin-left:30px;
`;
const PaginationInfoS = styled.span`
  display:inline-block;
  `;
const StyledFlexContainer = styled(FlexContainer)`
  margin:20px 10px;
`;
const StyledCard = styled(Card)`
  margin:auto;
  width:95%;
  height:270px;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
`;
const BarDiv = styled.div`
  width:1px;
  height:30px;
  background-color:lightgray;
  display:inline-block;
  margin-bottom:-6px;
`;
const StyledCheckbox = styled(Checkbox)`
 font-size:0.7em;
 color:#1890ffd9;
`;
const SpaceDiv = styled.div`
    display:inline-block
    width:20px;
`;
const SpaceDivF = styled.div`
    display:inline-block
    width:13px;
`;
const StyledButton = styled(Button)`
  font-size:0.7em;
  background-color:transparent;
  margin:0px 23px 0px -5px;
  width:100px;
  height:25px;
  color:#1890ffd9;
  border:1px solid #1890ffd9;
  font-weight:bold;
`;
const StyledAnc = styled(Button)`
    cursor:grab;
    background-color:transparent;
    border:none;
    outline:none;
    :hover{
      background-color:transparent;
      border:none;
      outline:none;
    }
    :active{
      background-color:transparent;
      border:none;
      outline:none;
    }
`;
