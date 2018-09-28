import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AssignmentTitle from './AssignmentTitle';
import { translate } from '../../utils/localization';
import Header from './Header';
import Main from './Main';
import MultipleChoice from '../MultipleChoice';
import {
  QUESTION_PROBLEM,
  QUESTION_OPTIONS,
  QUESTION_ANSWERS,
  ASSESSMENTID,
} from '../../constants/others';
import { addQuestion } from '../../actions/questions';
import { FlexContainer, DashboardControlBtn, LinkBtn } from '../common';
import { IconPreview } from '../../../../assessment/src/components/common/icons';

class MultipleChoiceQuestionEditor extends Component {
  state = {
    activePage: '',
    userSelections: [],
  };

  showAnwser = false;

  changeAnswerDisplay() {
    this.showAnswer = !this.showAnswer;
    this.activatePage('answer');
  }

  activatePage(page) {
    const { userSelections } = this.state;
    this.setState({
      activePage: page,
      userSelections: page === 'edit' ? [] : userSelections,
    });
  }

  isActivePage(page) {
    const { activePage } = this.state;
    return activePage === page;
  }

  onSaveClicked = () => {
    const { addQuestion: add } = this.props;
    console.log('save current question');
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    const answers = JSON.parse(localStorage.getItem(QUESTION_ANSWERS)) || [];
    const assessmentId = localStorage.getItem(ASSESSMENTID);
    const correctAnswer = [];
    answers.forEach((answer, index) => {
      if (answer) {
        correctAnswer.push(index);
      }
    });
    const question = {
      assessmentId,
      question: problem,
      options: JSON.parse(options),
      type: 'mcq',
      answer: JSON.stringify(correctAnswer),
    };
    add(question);
    // console.log('add question result:', json);
  };

  handleMultiSelect = (e) => {
    const { userSelections } = this.state;
    const index = parseInt(e.target.value, 10);
    userSelections[index] = e.target.checked;
    this.setState({ userSelections });
  };

  render() {
    const { activePage, userSelections } = this.state;
    return (
      <div>
        <Header>
          <FlexContainer justifyContent="space-between">
            <AssignmentTitle>{translate('common.layout.dashboard.title')}</AssignmentTitle>
            <div>
              {this.showAnswer && (
                <DashboardControlBtn
                  answerbtn
                  onClick={() => this.changeAnswerDisplay()}
                  active={this.isActivePage('answer')}
                >
                  <i className="fa fa-eye-slash" />
                  <span>{translate('common.layout.dashboard.hideanswerbtn')}</span>
                </DashboardControlBtn>
              )}
              {!this.showAnswer && (
                <DashboardControlBtn
                  answerbtn
                  onClick={() => this.changeAnswerDisplay()}
                  active={this.isActivePage('answer')}
                >
                  <i className="fa fa-eye" />
                  <span>{translate('common.layout.dashboard.showanswerbtn')}</span>
                </DashboardControlBtn>
              )}
              {/* <DashboardControlBtn
                onClick={() => this.activatePage('settings')}
                active={this.isActivePage('settings')}
              >
                <i className="fa fa-gear"></i>
                <span>{translate('common.layout.dashboard.settingbtn')}</span>
              </DashboardControlBtn> */}
              <DashboardControlBtn
                onClick={() => this.activatePage('edit')}
                active={this.isActivePage('edit')}
              >
                <i className="fa fa-pencil" />
                <span>{translate('common.layout.dashboard.editbtn')}</span>
              </DashboardControlBtn>
              <DashboardControlBtn
                onClick={() => this.activatePage('preview')}
                active={this.isActivePage('preview')}
              >
                <IconPreview width={15} height={15} />
                <span>{translate('common.layout.dashboard.previewbtn')}</span>
              </DashboardControlBtn>
              <DashboardControlBtn save onClick={this.onSaveClicked}>
                <i className="fa fa-floppy-o" />
                <span>{translate('common.layout.dashboard.savebtn')}</span>
              </DashboardControlBtn>
            </div>
          </FlexContainer>
          <LinkBtn>
            &lt;&nbsp;&nbsp;&nbsp;
            {translate('common.layout.dashboard.headerbackbtn')}
          </LinkBtn>
        </Header>
        <Main>
          <MultipleChoice
            activePage={activePage}
            showAnswer={this.showAnswer}
            userSelections={userSelections}
            handleMultiSelect={this.handleMultiSelect}
          />
        </Main>
      </div>
    );
  }
}

MultipleChoiceQuestionEditor.propTypes = {
  addQuestion: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  addQuestion: question => dispatch(addQuestion(question)),
});

export default connect(
  null,
  mapDispatchToProps,
)(MultipleChoiceQuestionEditor);
