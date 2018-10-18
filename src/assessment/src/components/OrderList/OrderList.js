import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import { cloneDeep } from 'lodash';

import {
  OrderListEdit,
  Question,
  OrderListPreview,
  OrderListReport,
  CorrectAnswers,
} from './index';
import { getPreviewIndexesListSelector, getPreivewTabSelector } from './selectors/preview';
import { updatePreviewListAction } from './actions/preview';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import { getQuestionsListSelector } from './selectors/questionsOrderList';

class OrderList extends Component {
  get validation() {
    const { item } = this.props;

    return {
      ...item.validation,
      valid_response: {
        score: item.validation.valid_response.score,
        value: item.validation.valid_response.value.map(val => item.list[val]),
      },
      alt_responses: item.validation.alt_responses.map(res => ({
        score: res.score,
        value: res.value.map(val => item.list[val]),
      })),
    };
  }

  componentDidMount() {
    const { updatePreviewList, item } = this.props;
    updatePreviewList(item.list.map((q, i) => i));
  }

  handleQuestionChange = (value) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, stimulus: value });
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;

    setQuestionData({ ...item, list: arrayMove(item.list, oldIndex, newIndex) });
  };

  handleQuestionsChange = (value, index) => {
    const { setQuestionData, item } = this.props;

    setQuestionData({
      ...item,
      list: item.list.map((q, i) => {
        if (i === index) {
          return value;
        }
        return q;
      }),
    });
  };

  handleDeleteQuestion = (index) => {
    const { setQuestionData, item, updatePreviewList } = this.props;
    const newItem = cloneDeep(item);

    newItem.list = newItem.list.filter((q, i) => i !== index);

    const indexList = newItem.list.map((val, i) => i);

    newItem.validation.valid_response.value = indexList;

    newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
      res.value = indexList;
      return res;
    });

    updatePreviewList(indexList);
    setQuestionData(newItem);
  };

  handleAddQuestion = () => {
    const { setQuestionData, item, t, updatePreviewList } = this.props;
    const newItem = cloneDeep(item);

    newItem.list = [
      ...item.list,
      `${t('common.initialoptionslist.itemprefix')} ${item.list.length}`,
    ];
    newItem.validation.valid_response.value = [
      ...newItem.validation.valid_response.value,
      newItem.validation.valid_response.value.length,
    ];

    if (newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
        res.value.push(res.value.length);
        return res;
      });
    }

    updatePreviewList(newItem.list.map((q, i) => i));

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
    const { updatePreviewList, previewListClear } = this.props;
    const newPreviewList = arrayMove(previewListClear, oldIndex, newIndex);

    updatePreviewList(newPreviewList);
  };

  handleAddAltResponse = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    newItem.validation.alt_responses.push({
      score: 1,
      value: newItem.list.map((q, i) => i),
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
    const { view, previewIndexesList, previewTab, smallSize, item, previewListClear } = this.props;

    if (!item) return null;

    return (
      <React.Fragment>
        {view === 'edit' && (
          <React.Fragment>
            <Question
              onQuestionChange={this.handleQuestionChange}
              value={item.stimulus}
              style={{ marginBottom: 30 }}
            />
            <OrderListEdit
              style={{ marginBottom: 30 }}
              questions={item.list}
              onSortEnd={this.onSortOrderListEnd}
              onQuestionsChange={this.handleQuestionsChange}
              onDeleteQuestion={this.handleDeleteQuestion}
              onAddQuestion={this.handleAddQuestion}
              useDragHandle
            />
            <CorrectAnswers
              onAddAltResponses={this.handleAddAltResponse}
              validation={this.validation}
              onSortCurrentAnswer={this.onSortCurrentAnswer}
              onSortAltAnswer={this.onSortAltAnswer}
              onDelete={this.handleDeleteAltAnswers}
              onUpdatePoints={this.handleUpdatePoints}
            />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            <QuestionText dangerouslySetInnerHTML={{ __html: item.stimulus }} />

            {previewTab === 'check' && (
              <OrderListReport
                questions={item.list}
                questionsList={item.list}
                validation={this.validation}
                validationState={item.validation}
                previewIndexesList={previewIndexesList}
              />
            )}

            {previewTab === 'show' && (
              <OrderListReport
                questions={item.list}
                questionsList={item.list}
                validation={this.validation}
                validationState={item.validation}
                previewIndexesList={previewIndexesList}
                showAnswers
              />
            )}

            {previewTab === 'clear' && (
              <OrderListPreview
                onSortEnd={this.onSortPreviewEnd}
                questions={previewListClear.map(index => item.list[index])}
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
  updatePreviewList: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  previewTab: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  previewListClear: PropTypes.any.isRequired,
};

OrderList.defaultProps = {
  smallSize: false,
  item: {},
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      previewIndexesList: getPreviewIndexesListSelector(state),
      previewTab: getPreivewTabSelector(state),
      previewListClear: getQuestionsListSelector(state),
    }),
    {
      updatePreviewList: updatePreviewListAction,
      setQuestionData: setQuestionDataAction,
    },
  ),
);

export default enhance(OrderList);

const QuestionText = styled.div`
  font-size: 14px;
  padding: 15px 0;
  font-weight: bold;
`;
