import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';

import { QuestionTextArea, Subtitle, CorrectAnswers } from '../../common';
import withPoints from '../../HOC/withPoints';
import CorrectAnswer from './CorrectAnswer';
import { EXACT_MATCH, CONTAINS } from '../../../constants/constantsForQuestions';

const OptionsList = withPoints(CorrectAnswer);

const EditShortText = ({ item, setQuestionData, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleAddAnswer = () => {
    const newItem = cloneDeep(item);

    if (!newItem.validation.alt_responses) {
      newItem.validation.alt_responses = [];
    }
    newItem.validation.alt_responses.push({
      score: 1,
      matching_rule: EXACT_MATCH,
      value: ''
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

  const handleScoringTypeChange = (value) => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.matching_rule = value;
    } else {
      newItem.validation.alt_responses[correctTab - 1].matching_rule = value;
    }

    setQuestionData(newItem);
  };

  const handleValueChange = (value) => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.value = value;
    } else {
      newItem.validation.alt_responses[correctTab - 1].value = value;
    }

    setQuestionData(newItem);
  };

  const renderOptions = () => (
    <OptionsList
      points={
        correctTab === 0
          ? item.validation.valid_response.score
          : item.validation.alt_responses[correctTab - 1].score
      }
      onSelectChange={handleScoringTypeChange}
      onChange={handleValueChange}
      options={[
        { value: EXACT_MATCH, label: 'Exact Match' },
        { value: CONTAINS, label: 'Any text containing' }
      ]}
      selectValue={
        correctTab === 0
          ? item.validation.valid_response.matching_rule
          : item.validation.alt_responses[correctTab - 1].matching_rule
      }
      inputValue={
        correctTab === 0
          ? item.validation.valid_response.value
          : item.validation.alt_responses[correctTab - 1].value
      }
      onChangePoints={handlePointsChange}
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

EditShortText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(EditShortText);
