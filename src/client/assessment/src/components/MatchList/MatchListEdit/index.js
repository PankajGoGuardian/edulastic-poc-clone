import React, { Fragment, useState } from 'react';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import PropTypes from 'prop-types';

import { Paper } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import withAddButton from '../../HOC/withAddButton';
import { SortableList, QuestionTextArea, Subtitle, CorrectAnswers } from '../../common';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import withPoints from '../../HOC/withPoints';
import MatchListPreview from '../MatchListPreview';

const OptionsList = withPoints(MatchListPreview);

const List = withAddButton(SortableList);

const MatchListEdit = ({ item, setQuestionData, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleAdd = () => {
    const newItem = cloneDeep(item);

    newItem.list.push('');

    newItem.validation.valid_response.value.push('');
    newItem.validation.alt_responses.forEach((ite) => {
      ite.value.push('');
    });

    setQuestionData(newItem);
  };

  const handleAddResp = () => {
    const newItem = cloneDeep(item);

    newItem.possible_responses.push('');

    setQuestionData(newItem);
  };

  const handleRemove = (index) => {
    const newItem = cloneDeep(item);

    newItem.list.splice(index, 1);

    setQuestionData(newItem);
  };

  const handleRemoveResp = (index) => {
    const newItem = cloneDeep(item);

    const spliceRes = newItem.possible_responses.splice(index, 1);

    newItem.validation.valid_response.value.splice(
      newItem.validation.valid_response.value.indexOf(spliceRes),
      1
    );

    newItem.validation.alt_responses.forEach((ite) => {
      ite.value.splice(ite.value.indexOf(spliceRes), 1);
    });

    setQuestionData(newItem);
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const newItem = cloneDeep(item);

    newItem.list = arrayMove(item.list, oldIndex, newIndex);
    setQuestionData(newItem);
  };

  const handleSortEndResp = ({ oldIndex, newIndex }) => {
    const newItem = cloneDeep(item);

    newItem.possible_responses = arrayMove(item.possible_responses, oldIndex, newIndex);
    setQuestionData(newItem);
  };

  const handleChange = (index, value) => {
    const newItem = cloneDeep(item);

    newItem.list[index] = value;
    setQuestionData(newItem);
  };

  const handleChangeResp = (index, value) => {
    const newItem = cloneDeep(item);

    newItem.validation.valid_response.value[
      newItem.validation.valid_response.value.indexOf(newItem.possible_responses[index])
    ] = value;
    newItem.validation.alt_responses.forEach((ite) => {
      ite.value[ite.value.indexOf(newItem.possible_responses[index])] = value;
    });

    newItem.possible_responses[index] = value;

    setQuestionData(newItem);
  };

  const handleAddAnswer = () => {
    const newItem = cloneDeep(item);

    if (!newItem.validation.alt_responses) {
      newItem.validation.alt_responses = [];
    }
    newItem.validation.alt_responses.push({
      score: 1,
      value: Array.from({ length: item.validation.valid_response.value.length }).fill(null)
    });

    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = (tabIndex) => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses.splice(tabIndex, 1);

    setCorrectTab(0);
    setQuestionData(newItem);
  };

  const handlePointsChange = (val) => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.score = val;
    } else {
      newItem.validation.alt_responses[correctTab - 1].score = val;
    }

    setQuestionData(newItem);
  };

  const handleAnswerChange = (ans) => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.value = ans;
    } else {
      newItem.validation.alt_responses[correctTab - 1].value = ans;
    }

    setQuestionData(newItem);
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0
          ? item.validation.valid_response.score
          : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0
          ? item.validation.valid_response.value
          : item.validation.alt_responses[correctTab - 1].value
      }
      view="edit"
    />
  );

  return (
    <Fragment>
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>{t('component.sortList.editQuestionSubtitle')}</Subtitle>
        <QuestionTextArea
          placeholder="Enter question"
          onChange={stimulus => handleItemChangeChange('stimulus', stimulus)}
          value={item.stimulus}
        />
        <Subtitle>{t('component.sortList.editListSubtitle')}</Subtitle>
        <List
          buttonText="Add new"
          items={item.list.map(ite => ite)}
          onAdd={handleAdd}
          onSortEnd={handleSortEnd}
          onChange={handleChange}
          onRemove={handleRemove}
          useDragHandle
          columns={1}
        />
        <Subtitle>{t('component.matchList.editPossibleResponses')}</Subtitle>
        <List
          items={item.possible_responses.map(ite => ite)}
          onAdd={handleAddResp}
          onSortEnd={handleSortEndResp}
          onChange={handleChangeResp}
          onRemove={handleRemoveResp}
          useDragHandle
          columns={1}
        />

        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
        />
      </Paper>
    </Fragment>
  );
};

MatchListEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )(MatchListEdit)
);
