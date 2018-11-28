import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { OrderListPreview, OrderListReport, CorrectAnswers } from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import QuestionHeader from '../MultipleChoice/common/QuestionHeader';
import { QuestionTextArea, SortableList } from '../common';

const EmptyWrapper = styled.div``;

class OrderList extends Component {
  get validation() {
    const { item } = this.props;

    return {
      ...item.validation,
      valid_response: {
        score: item.validation.valid_response.score,
        value: item.validation.valid_response.value.map(val => item.list[val])
      },
      alt_responses: item.validation.alt_responses.map(res => ({
        score: res.score,
        value: res.value.map(val => item.list[val])
      }))
    };
  }

  componentDidMount() {
    const { item, saveAnswer, userAnswer } = this.props;

    if (!userAnswer.length) {
      saveAnswer(item.list.map((q, i) => i));
    }
  }

  handleQuestionChange = (value) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, stimulus: value });
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;

    setQuestionData({
      ...item,
      list: arrayMove(item.list, oldIndex, newIndex)
    });
  };

  handleQuestionsChange = (value, index) => {
    const { setQuestionData, item } = this.props;
    const newData = cloneDeep(item);

    newData.list[value] = index;

    setQuestionData(newData);
  };

  handleDeleteQuestion = (index) => {
    const { setQuestionData, item, saveAnswer } = this.props;
    const newItem = cloneDeep(item);

    newItem.list = newItem.list.filter((q, i) => i !== index);

    const indexList = newItem.list.map((val, i) => i);

    newItem.validation.valid_response.value = indexList;

    newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
      res.value = indexList;
      return res;
    });

    saveAnswer(indexList);
    setQuestionData(newItem);
  };

  handleAddQuestion = () => {
    const { setQuestionData, item, t, saveAnswer } = this.props;
    const newItem = cloneDeep(item);

    newItem.list = [
      ...item.list,
      `${t('common.initialoptionslist.itemprefix')} ${item.list.length}`
    ];
    newItem.validation.valid_response.value = [
      ...newItem.validation.valid_response.value,
      newItem.validation.valid_response.value.length
    ];

    if (newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
        res.value.push(res.value.length);
        return res;
      });
    }

    saveAnswer(newItem.list.map((q, i) => i));
    setQuestionData(newItem);
  };

  onSortCurrentAnswer = ({ oldIndex, newIndex }) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);
    const newValue = arrayMove(item.validation.valid_response.value, oldIndex, newIndex);

    newItem.validation.valid_response.value = newValue;

    setQuestionData(newItem);
  };

  onSortAltAnswer = ({ oldIndex, newIndex, altIndex }) => {
    const { item, setQuestionData } = this.props;
    const newItem = cloneDeep(item);
    const newValue = arrayMove(item.validation.alt_responses[altIndex].value, oldIndex, newIndex);

    newItem.validation.alt_responses[altIndex].value = newValue;

    setQuestionData(newItem);
  };

  onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const { saveAnswer, userAnswer } = this.props;

    const newPreviewList = arrayMove(userAnswer, oldIndex, newIndex);

    saveAnswer(newPreviewList);
  };

  handleAddAltResponse = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    newItem.validation.alt_responses.push({
      score: 1,
      value: newItem.list.map((q, i) => i)
    });

    setQuestionData(newItem);
  };

  handleDeleteAltAnswers = (index) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    newItem.validation.alt_responses.splice(index, 1);

    setQuestionData(newItem);
  };

  handleUpdatePoints = (points, index) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    if (index !== undefined && typeof index === 'number') {
      newItem.validation.alt_responses[index].score = points;
    } else {
      newItem.validation.valid_response.score = points;
    }

    setQuestionData(newItem);
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer, testItem, evaluation } = this.props;

    if (!item) return null;

    const Wrapper = testItem ? EmptyWrapper : Paper;
    return (
      <React.Fragment>
        {view === 'edit' && (
          <Paper>
            <QuestionTextArea
              onChange={this.handleQuestionChange}
              value={item.stimulus}
              style={{ marginBottom: 30 }}
            />
            <SortableList
              items={item.list}
              onSortEnd={this.onSortOrderListEnd}
              useDragHandle
              onRemove={this.handleDeleteQuestion}
              onChange={this.handleQuestionsChange}
            />
            <CorrectAnswers
              onAddAltResponses={this.handleAddAltResponse}
              validation={this.validation}
              onSortCurrentAnswer={this.onSortCurrentAnswer}
              onSortAltAnswer={this.onSortAltAnswer}
              onDelete={this.handleDeleteAltAnswers}
              onUpdatePoints={this.handleUpdatePoints}
            />
          </Paper>
        )}
        {view === 'preview' && (
          <Wrapper>
            <QuestionHeader
              smallSize={smallSize}
              dangerouslySetInnerHTML={{ __html: item.stimulus }}
            />

            {previewTab === 'check' && (
              <OrderListReport
                onSortEnd={this.onSortPreviewEnd}
                questionsList={item.list}
                previewIndexesList={userAnswer}
                evaluation={evaluation}
              />
            )}

            {previewTab === 'show' && (
              <OrderListReport
                onSortEnd={this.onSortPreviewEnd}
                questionsList={item.list}
                previewIndexesList={userAnswer}
                showAnswers
                evaluation={evaluation}
                validation={item.validation}
                list={item.list}
              />
            )}

            {previewTab === 'clear' && (
              <OrderListPreview
                onSortEnd={this.onSortPreviewEnd}
                questions={userAnswer.map(index => item.list[index])}
                smallSize={smallSize}
              />
            )}
          </Wrapper>
        )}
      </React.Fragment>
    );
  }
}

OrderList.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any
};

OrderList.defaultProps = {
  previewTab: 'clear',
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(OrderList);
