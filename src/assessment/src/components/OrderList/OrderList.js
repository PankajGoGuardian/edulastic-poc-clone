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
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    newItem.list = newItem.list.filter((q, i) => i !== index);
    newItem.validation.valid_response.value = newItem.validation.valid_response.value.filter(
      val => val !== index,
    );
    setQuestionData(newItem);
  };

  handleAddQuestion = () => {
    const { setQuestionData, item, t } = this.props;
    setQuestionData({
      ...item,
      list: [...item.list, `${t('common.initialoptionslist.itemprefix')} ${item.list.length}`],
    });
  };

  onSortCurrentAnswer = ({ oldIndex, newIndex }) => {
    const { setQuestionData, item } = this.props;
    const newValue = arrayMove(item.validation.valid_response.value, oldIndex, newIndex);

    setQuestionData({
      ...item,
      validation: {
        ...item.validation,
        valid_response: {
          score: item.validation.valid_response.score,
          value: newValue,
        },
      },
    });
  };

  onSortAltAnswer = ({ oldIndex, newIndex, altIndex }) => {
    const { item, setQuestionData } = this.props;
    const newValue = arrayMove(item.validation.alt_responses[altIndex].value, oldIndex, newIndex);
    console.log('newValue', newValue);

    setQuestionData({
      ...item,
      validation: {
        ...item.validation,
        alt_responses: item.validation.alt_responses.map((res, i) => {
          if (i === altIndex) {
            return {
              ...res,
              value: newValue.map(q => item.list.findIndex(it => q === it)),
            };
          }
          return res;
        }),
      },
    });
  };

  onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const { updatePreviewList, item } = this.props;
    const newPreviewList = arrayMove(item.list, oldIndex, newIndex);

    updatePreviewList(newPreviewList.map(q => item.list.findIndex(i => q === i)));
  };

  render() {
    const { view, previewIndexesList, previewTab, smallSize, item } = this.props;

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
              validation={this.validation}
              onSortCurrentAnswer={this.onSortCurrentAnswer}
              onSortAltAnswer={this.onSortAltAnswer}
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
                questions={item.list}
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
