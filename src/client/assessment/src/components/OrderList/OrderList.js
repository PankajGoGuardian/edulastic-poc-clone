import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';

import { OrderListPreview, OrderListReport } from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import QuestionHeader from '../MultipleChoice/common/QuestionHeader';
import { QuestionTextArea, SortableList, Subtitle, CorrectAnswers } from '../common';
import { EDIT, PREVIEW, CHECK, SHOW, CLEAR } from '../../constants/constantsForQuestions';
import withAddButton from '../HOC/withAddButton';
import withPoints from '../HOC/withPoints';

const EmptyWrapper = styled.div``;

const List = withAddButton(SortableList);
const OptionsList = withPoints(SortableList);

const OrderList = (props) => {
  const [correctTab, setCorrectTab] = useState(0);

  useEffect(() => {
    const { item, saveAnswer, userAnswer } = props;
    if (userAnswer.length === 0) {
      saveAnswer(item.list.map((q, i) => i));
    }
  });

  const handleQuestionChange = (value) => {
    const { setQuestionData, item } = props;
    setQuestionData({ ...item, stimulus: value });
  };

  const onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = props;
    const newData = cloneDeep(item);

    newData.list = arrayMove(newData.list, oldIndex, newIndex);

    setQuestionData(newData);
  };

  const handleQuestionsChange = (value, index) => {
    const { setQuestionData, item } = props;
    const newData = cloneDeep(item);

    newData.list[value] = index;

    setQuestionData(newData);
  };

  const handleDeleteQuestion = (index) => {
    const { setQuestionData, item, saveAnswer } = props;
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

  const handleAddQuestion = () => {
    const { setQuestionData, item, saveAnswer } = props;
    const newItem = cloneDeep(item);

    newItem.list = [...item.list, ''];
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

  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    const { setQuestionData, item } = props;
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.value = arrayMove(
        newItem.validation.valid_response.value,
        oldIndex,
        newIndex
      );
    } else {
      newItem.validation.alt_responses[correctTab - 1].value = arrayMove(
        newItem.validation.alt_responses[correctTab - 1].value,
        oldIndex,
        newIndex
      );
    }

    setQuestionData(newItem);
  };

  const onSortPreviewEnd = ({ oldIndex, newIndex }) => {
    const { saveAnswer, userAnswer } = props;

    const newPreviewList = arrayMove(userAnswer, oldIndex, newIndex);

    saveAnswer(newPreviewList);
  };

  const handleAddAltResponse = () => {
    const { setQuestionData, item } = props;
    const newItem = cloneDeep(item);

    newItem.validation.alt_responses.push({
      score: 1,
      value: newItem.list.map((q, i) => i)
    });

    setCorrectTab(correctTab + 1);
    setQuestionData(newItem);
  };

  const handleDeleteAltAnswers = (index) => {
    const { setQuestionData, item } = props;
    const newItem = cloneDeep(item);

    newItem.validation.alt_responses.splice(index, 1);

    setCorrectTab(0);
    setQuestionData(newItem);
  };

  const handleUpdatePoints = (points) => {
    const { setQuestionData, item } = props;
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.score = points;
    } else {
      newItem.validation.alt_responses[correctTab - 1].score = points;
    }

    setQuestionData(newItem);
  };

  const renderOptions = () => {
    const { item } = props;

    return (
      <OptionsList
        prefix="options2"
        readOnly
        items={
          correctTab === 0
            ? item.validation.valid_response.value.map(ind => item.list[ind])
            : item.validation.alt_responses[correctTab - 1].value.map(ind => item.list[ind])
        }
        onSortEnd={handleCorrectSortEnd}
        useDragHandle
        columns={1}
        points={
          correctTab === 0
            ? item.validation.valid_response.score
            : item.validation.alt_responses[correctTab - 1].score
        }
        onChangePoints={handleUpdatePoints}
      />
    );
  };

  const { view, previewTab, smallSize, item, userAnswer, testItem, evaluation, t } = props;

  if (!item) return null;

  const Wrapper = testItem ? EmptyWrapper : Paper;
  return (
    <Fragment>
      {view === EDIT && (
        <Paper>
          <Subtitle>{t('component.sortList.editQuestionSubtitle')}</Subtitle>

          <QuestionTextArea
            onChange={handleQuestionChange}
            value={item.stimulus}
            style={{ marginBottom: 30 }}
          />
          <Subtitle>{t('component.sortList.editListSubtitle')}</Subtitle>
          <List
            onAdd={handleAddQuestion}
            items={item.list}
            onSortEnd={onSortOrderListEnd}
            useDragHandle
            onRemove={handleDeleteQuestion}
            onChange={handleQuestionsChange}
          />

          <CorrectAnswers
            onTabChange={setCorrectTab}
            correctTab={correctTab}
            onAdd={handleAddAltResponse}
            validation={item.validation}
            options={renderOptions()}
            onCloseTab={handleDeleteAltAnswers}
          />
        </Paper>
      )}
      {view === PREVIEW && (
        <Wrapper>
          <QuestionHeader
            smallSize={smallSize}
            dangerouslySetInnerHTML={{ __html: item.stimulus }}
          />

          {previewTab === CHECK && (
            <OrderListReport
              onSortEnd={onSortPreviewEnd}
              questionsList={item.list}
              previewIndexesList={userAnswer}
              evaluation={evaluation}
            />
          )}

          {previewTab === SHOW && (
            <OrderListReport
              onSortEnd={onSortPreviewEnd}
              questionsList={item.list}
              previewIndexesList={userAnswer}
              showAnswers
              evaluation={evaluation}
              validation={item.validation}
              list={item.list}
            />
          )}

          {previewTab === CLEAR && (
            <OrderListPreview
              onSortEnd={onSortPreviewEnd}
              questions={userAnswer.map(index => item.list[index])}
              smallSize={smallSize}
            />
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

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
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: ''
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(OrderList);
