import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';

import {
  OrderListEdit,
  Question,
  OrderListPreview,
  OrderListReport,
  CorrectAnswers,
} from './index';
import {
  getStimulusSelector,
  getQuestionsListSelector,
  getValidationSelector,
  validationSelector,
} from './selectors/questionsOrderList';
import {
  updateStimulusAction,
  updateQuestionsListAction,
  updateValidationAction,
} from './actions/questionsOrderList';
import {
  getPreviewListSelector,
  getPreviewIndexesListSelector,
  getPreivewTabSelector,
} from './selectors/preview';
import { updatePreviewListAction } from './actions/preview';

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
    const { questionsList, t } = this.props;

    this.updateQuestions([
      ...questionsList,
      `${t('common.initialoptionslist.itemprefix')} ${questionsList.length}`,
    ]);
  };

  updateQuestions = (list) => {
    const { updateQuestionsList, updatePreviewList } = this.props;

    updateQuestionsList(list);
    updatePreviewList(list.map((item, i) => i));
  };

  onSortCurrentAnswer = ({ oldIndex, newIndex }) => {
    const { updateValidation, validation, questionsList, validationState } = this.props;
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
    const { validation, updateValidation, validationState, questionsList } = this.props;
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
      smallSize,
      initialData,
    } = this.props;

    const previewQuestionsList = initialData.list !== 0 ? initialData.list : previewList;
    const previewStimulus = initialData.stimulus ? initialData.stimulus : stimulus;
    return (
      <React.Fragment>
        {view === 'edit' && (
          <React.Fragment>
            <Question
              onQuestionChange={this.handleQuestionChange}
              value={stimulus}
              style={{ marginBottom: 30 }}
            />
            <OrderListEdit
              style={{ marginBottom: 30 }}
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
            <QuestionText dangerouslySetInnerHTML={{ __html: previewStimulus }} />

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
              <OrderListPreview
                onSortEnd={this.onSortPreviewEnd}
                questions={previewQuestionsList}
                smallSize={smallSize}
              />
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
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  initialData: PropTypes.object,
};

OrderList.defaultProps = {
  smallSize: false,
  initialData: {},
};

const enhance = compose(
  withNamespaces('author'),
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

const QuestionText = styled.div`
  font-size: 14px;
  padding: 15px 0;
  font-weight: bold;
`;
