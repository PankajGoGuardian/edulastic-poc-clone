import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';

import OrderListEdit from './OrderListEdit';
import Question from './Question';
import CorrectAnswers from './CorrectAnswers';
import OrderListReport from './OrderListReport';
import OrderListPreview from './OrderListPreview';
import {
  getStimulusSelector,
  getQuestionsListSelector,
  getValidationSelector,
  validationSelector,
  updateStimulusAction,
  updateQuestionsListAction,
  updateValidationAction,
} from '../../../ducks/questionsOrderList';
import {
  getPreviewListSelector,
  getPreviewIndexesListSelector,
  getPreivewTabSelector,
  updatePreviewListAction,
} from '../../../ducks/preview';
import { Heading } from '../common';

class OrderList extends Component {
  componentDidMount() {
    const { updatePreviewList, questionsList } = this.props;

    updatePreviewList(questionsList.map((item, i) => i));
  }

  handleQuestionChange = (value) => {
    const { updateStimulus } = this.props;
    updateStimulus(value);
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { questionsList } = this.props;

    this.updateQuestions(arrayMove(questionsList, oldIndex, newIndex));
  };

  handleQuestionsChange = (value, index) => {
    const { updateQuestionsList, questionsList } = this.props;

    updateQuestionsList(
      questionsList.map((q, i) => {
        if (i === index) {
          return value;
        }
        return q;
      }),
    );
  };

  handleDeleteQuestion = (index) => {
    const { questionsList } = this.props;
    this.updateQuestions(questionsList.filter((q, i) => i !== index));
  };

  handleAddQuestion = () => {
    const { questionsList } = this.props;

    this.updateQuestions([...questionsList, `Choice ${questionsList.length}`]);
  };

  updateQuestions = (list) => {
    const { updateQuestionsList, updatePreviewList } = this.props;

    updateQuestionsList(list);
    updatePreviewList(list.map((item, i) => i));
  };

  onSortCurrentAnswer = ({ oldIndex, newIndex }) => {
    const {
      updateValidation, validation, questionsList, validationState,
    } = this.props;
    const newValue = arrayMove(validation.valid_response.value, oldIndex, newIndex);

    updateValidation({
      ...validationState,
      valid_response: {
        score: validation.valid_response.score,
        value: newValue.map(q => questionsList.findIndex(i => q === i)),
      },
    });
  };

  onSortAltAnswer = ({ oldIndex, newIndex, altIndex }) => {
    const {
      validation, updateValidation, validationState, questionsList,
    } = this.props;
    const newValue = arrayMove(validation.alt_responses[altIndex].value, oldIndex, newIndex);
    console.log('newValue', newValue);

    updateValidation({
      ...validationState,
      alt_responses: validationState.alt_responses.map((res, i) => {
        if (i === altIndex) {
          return {
            ...res,
            value: newValue.map(q => questionsList.findIndex(item => q === item)),
          };
        }
        return res;
      }),
    });
  };

  onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const { updatePreviewList, previewList, questionsList } = this.props;
    const newPreviewList = arrayMove(previewList, oldIndex, newIndex);

    updatePreviewList(newPreviewList.map(q => questionsList.findIndex(i => q === i)));
  };

  render() {
    const {
      view,
      questionsList,
      validation,
      stimulus,
      previewList,
      previewIndexesList,
      validationState,
      previewTab,
    } = this.props;

    return (
      <React.Fragment>
        {view === 'edit' && (
          <React.Fragment>
            <Question onQuestionChange={this.handleQuestionChange} value={stimulus} />
            <OrderListEdit
              questions={questionsList}
              onSortEnd={this.onSortOrderListEnd}
              onQuestionsChange={this.handleQuestionsChange}
              onDeleteQuestion={this.handleDeleteQuestion}
              onAddQuestion={this.handleAddQuestion}
              useDragHandle
            />
            <CorrectAnswers
              validation={validation}
              onSortCurrentAnswer={this.onSortCurrentAnswer}
              onSortAltAnswer={this.onSortAltAnswer}
            />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            <Heading>{stimulus}</Heading>

            {previewTab === 'check' && (
              <OrderListReport
                questions={previewList}
                questionsList={questionsList}
                validation={validation}
                validationState={validationState}
                previewIndexesList={previewIndexesList}
              />
            )}

            {previewTab === 'show' && (
              <OrderListReport
                questions={previewList}
                questionsList={questionsList}
                validation={validation}
                validationState={validationState}
                previewIndexesList={previewIndexesList}
                showAnswers
              />
            )}

            {previewTab === 'clear' && (
              <OrderListPreview onSortEnd={this.onSortPreviewEnd} questions={previewList} />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

OrderList.propTypes = {
  updateStimulus: PropTypes.func.isRequired,
  updateQuestionsList: PropTypes.func.isRequired,
  updatePreviewList: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  stimulus: PropTypes.string.isRequired,
  questionsList: PropTypes.array.isRequired,
  validation: PropTypes.object.isRequired,
  updateValidation: PropTypes.func.isRequired,
  previewList: PropTypes.array.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  validationState: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
};

const enhance = compose(
  connect(
    state => ({
      stimulus: getStimulusSelector(state),
      questionsList: getQuestionsListSelector(state),
      validation: getValidationSelector(state),
      previewList: getPreviewListSelector(state),
      previewIndexesList: getPreviewIndexesListSelector(state),
      validationState: validationSelector(state),
      previewTab: getPreivewTabSelector(state),
    }),
    {
      updateStimulus: updateStimulusAction,
      updateQuestionsList: updateQuestionsListAction,
      updatePreviewList: updatePreviewListAction,
      updateValidation: updateValidationAction,
    },
  ),
);

export default enhance(OrderList);
