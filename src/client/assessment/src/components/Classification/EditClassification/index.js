import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import { Input, Row, Col } from 'antd';

import { Paper } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { secondaryTextColor } from '@edulastic/colors';

import { QuestionTextArea, Subtitle, SortableList, CorrectAnswers } from '../../common';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import withAddButton from '../../HOC/withAddButton';
import withPoints from '../../HOC/withPoints';
import ClassificationPreview from '../ClassificationPreview';

const List = withAddButton(SortableList);

const OptionsList = withPoints(ClassificationPreview);

const EditClassification = ({ item, setQuestionData, t }) => {
  const { stimulus, ui_style } = item;

  const [correctTab, setCorrectTab] = useState(0);

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleAdd = prop => () => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop].push('');

    setQuestionData(newItem);
  };

  const handleRemove = prop => (index) => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop].splice(index, 1);

    setQuestionData(newItem);
  };

  const handleSortEnd = prop => ({ oldIndex, newIndex }) => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop] = arrayMove(item.ui_style[prop], oldIndex, newIndex);
    setQuestionData(newItem);
  };

  const handleChange = prop => (index, value) => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop][index] = value;
    setQuestionData(newItem);
  };

  const onUiChange = prop => (val) => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop] = val;
    setQuestionData(newItem);
  };

  const handleAddAnswer = () => {
    const newItem = cloneDeep(item);

    if (!newItem.validation.alt_responses) {
      newItem.validation.alt_responses = [];
    }
    newItem.validation.alt_responses.push({
      score: 1,
      value: Array.from({ length: item.validation.valid_response.value.length }).fill([])
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
          onChange={stim => handleItemChangeChange('stimulus', stim)}
          value={stimulus}
        />

        <Row gutter={70}>
          <Col span={12}>
            <Subtitle>{t('component.classification.columnsSubtitle')}</Subtitle>

            <Subtitle fontSize={13} padding="0 0 16px 0" color={secondaryTextColor}>
              {t('component.classification.columnsCountSubtitle')}
            </Subtitle>

            <Input
              size="large"
              value={ui_style.column_count}
              onChange={e => onUiChange('column_count')(+e.target.value)}
            />

            <Subtitle fontSize={13} color={secondaryTextColor}>
              {t('component.classification.editColListSubtitle')}
            </Subtitle>

            <List
              buttonText="Add new column"
              items={item.ui_style.column_titles.map(ite => ite)}
              onAdd={handleAdd('column_titles')}
              onSortEnd={handleSortEnd('column_titles')}
              onChange={handleChange('column_titles')}
              onRemove={handleRemove('column_titles')}
              useDragHandle
              columns={1}
            />
          </Col>
          <Col span={12}>
            <Subtitle>{t('component.classification.rowsSubtitle')}</Subtitle>

            <Subtitle fontSize={13} padding="0 0 16px 0" color={secondaryTextColor}>
              {t('component.classification.rowsCountSubtitle')}
            </Subtitle>

            <Input
              size="large"
              value={ui_style.row_count}
              onChange={e => onUiChange('row_count')(+e.target.value)}
            />

            <Subtitle fontSize={13} color={secondaryTextColor}>
              {t('component.classification.editRowListSubtitle')}
            </Subtitle>

            <List
              buttonText="Add new row"
              items={item.ui_style.row_titles.map(ite => ite)}
              onAdd={handleAdd('row_titles')}
              onSortEnd={handleSortEnd('row_titles')}
              onChange={handleChange('row_titles')}
              onRemove={handleRemove('row_titles')}
              useDragHandle
              columns={1}
            />
          </Col>
        </Row>
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

EditClassification.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )(EditClassification)
);
