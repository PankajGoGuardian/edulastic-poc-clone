import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv } from '@edulastic/common';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
  CorrectAnswers
} from './index';
import { getValidationSelector } from '../../selectors/questionCommon';
import { updateItemByIdAction } from '../../actions/items';
import { addQuestion, addAnswer } from '../../actions/questions';
import { getPreivewTabSelector } from './selectors/preview';
import { ASSESSMENTID } from '../../constants/others';

class MultipleChoice extends Component {
  state = {
    userSelections: []
  };

  componentDidMount() {
    const { questionsList, saveClicked } = this.props;
    const userSelections = Array(questionsList.length).fill(false);
    this.setState({ userSelections });
    if (saveClicked) {
      this.saveData();
    }
  }

  saveData = () => {
    const { updateItemById, add } = this.props;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit
    } = this.getRenderData();
    updateItemById({
      ...itemForEdit,
      id: itemForEdit._id,
      reference: itemForEdit.id,
      stimulus: previewStimulus,
      list: previewDisplayOptions
    });
    const question = {
      assessmentId: localStorage.getItem(ASSESSMENTID),
      question: previewStimulus,
      options: previewDisplayOptions.map((option, index) => ({
        value: index,
        label: option
      })),
      type: itemForEdit.type,
      answer: itemForEdit.validation.valid_response.value
    };
    add(question);
  };

  getRenderData = () => {
    const {
      stimulus,
      questionsList,
      validation,
      item,
      smallSize,
      history
    } = this.props;
    const locationState = history.location.state;
    const isDetailPage =
      locationState !== undefined ? locationState.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    let itemForEdit;
    if (smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.list || item.options;
      itemForEdit = item;
    } else {
      previewStimulus = stimulus;
      previewDisplayOptions = questionsList;
      itemForEdit = {
        ...item,
        stimulus,
        list: questionsList,
        validation
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit
    };
  };

  render() {
    const {
      view,
      previewTab,
      smallSize,
      item,
      validation,
      addAnswer,
      answer,
      question
    } = this.props;
    const { userSelections } = this.state;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit
    } = this.getRenderData();

    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring key={item} item={itemForEdit} />
            <CorrectAnswers
              validation={validation}
              options={previewDisplayOptions}
              question={previewStimulus}
            />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            {previewTab === 'check' && (
              <MultipleChoiceReport
                checkAnswer
                userSelections={userSelections}
                options={previewDisplayOptions}
                question={previewStimulus}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'show' && (
              <MultipleChoiceReport
                showAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                userSelections={userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'clear' && (
              <MultipleChoiceDisplay
                preview
                key={previewDisplayOptions && previewStimulus}
                smallSize={smallSize}
                options={previewDisplayOptions}
                answer={answer}
                question={previewStimulus}
                addAnswer={addAnswer}
                data={question}
                userSelections={
                  !!item && item.userSelections ? item.userSelections : []
                }
                onChange={addAnswer}
              />
            )}
          </React.Fragment>
        )}
      </PaddingDiv>
    );
  }
}

MultipleChoice.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  stimulus: PropTypes.string,
  questionsList: PropTypes.array,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  validation: PropTypes.object,
  saveClicked: PropTypes.bool,
  updateItemById: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
};

MultipleChoice.defaultProps = {
  stimulus: '',
  questionsList: [],
  item: {},
  smallSize: false,
  saveClicked: false,
  history: {},
  validation: {}
};

const enhance = compose(
  withRouter,
  connect(
    state => {
      const { questions, currentQuestion } = state.assessmentQuestions;

      const question = questions[currentQuestion] || {};

      return {
        question,
        stimulus: question.stimulus,
        questionsList: question.options,
        previewTab: getPreivewTabSelector(state),
        validation: getValidationSelector(state)
      };
    },
    {
      addAnswer,
      updateItemById: updateItemByIdAction,
      add: addQuestion
    }
  )
);

export default enhance(MultipleChoice);
