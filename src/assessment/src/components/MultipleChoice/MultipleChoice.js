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
  CorrectAnswers,
} from './index';
import { getValidationSelector } from '../../selectors/questionCommon';
import { updateItemByIdAction } from '../../actions/items';
import {
  addQuestion as addQuestionAction,
  addAnswer as addAnswerAction,
} from '../../actions/questions';
import { getPreivewTabSelector } from './selectors/preview';

class MultipleChoice extends Component {
  state = {
    userSelections: [],
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
    const { previewStimulus, previewDisplayOptions, itemForEdit } = this.getRenderData();
    updateItemById({
      ...itemForEdit,
      id: itemForEdit._id,
      reference: itemForEdit.id,
      stimulus: previewStimulus,
      list: previewDisplayOptions,
    });
    const question = {
      question: previewStimulus,
      options: previewDisplayOptions.map((option, index) => ({
        value: index,
        label: option,
      })),
      type: itemForEdit.type,
      answer: itemForEdit.validation.valid_response.value,
    };
    add(question);
  };

  getRenderData = () => {
    const { questionsList, validation, item, smallSize, history } = this.props;
    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    let itemForEdit;
    if (smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.list || item.options;
      itemForEdit = item;
    } else {
      previewStimulus = item.stimulus;
      previewDisplayOptions = questionsList;
      itemForEdit = {
        ...item,
        stimulus: item.stimulus,
        list: questionsList,
        validation,
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
    };
  };

  render() {
    const { view, previewTab, smallSize, item, validation, addAnswer, answer } = this.props;
    const { userSelections } = this.state;
    const { previewStimulus, previewDisplayOptions, itemForEdit } = this.getRenderData();

    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring item={itemForEdit} />
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
                data={item}
                userSelections={!!item && item.userSelections ? item.userSelections : []}
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
  questionsList: PropTypes.array,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  validation: PropTypes.object,
  saveClicked: PropTypes.bool,
  updateItemById: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  answer: PropTypes.any,
  addAnswer: PropTypes.func.isRequired,
};

MultipleChoice.defaultProps = {
  questionsList: [],
  item: {},
  smallSize: false,
  saveClicked: false,
  history: {},
  validation: {},
  answer: {},
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
      validation: getValidationSelector(state),
    }),
    {
      addAnswer: addAnswerAction,
      updateItemById: updateItemByIdAction,
      add: addQuestionAction,
    },
  ),
);

export default enhance(MultipleChoice);
