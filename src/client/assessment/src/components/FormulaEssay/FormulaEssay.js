import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import { typedList as typedListTypes } from '@edulastic/constants';
import uuidv4 from 'uuid/v4';

import { setQuestionDataAction } from '../../../../author/src/actions/question';
import { QuestionTextArea, Subtitle, TypedList } from '../common';
import { CLEAR, PREVIEW, EDIT } from '../../constants/constantsForQuestions';
import { checkAnswerAction } from '../../../../author/src/actions/testItem';
import FormulaEssayPreview from './FormulaEssayPreview';
import FormulaEssayOptions from './FormulaEssayOptions';

const EmptyWrapper = styled.div``;

const selectData = [
  { value: '', label: '' },
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
  { value: 'removeFormat', label: 'Clear formatting' },
  { value: 'unorderedList', label: 'Bullet list' },
  { value: 'orderedList', label: 'Numbered list' },
  { value: 'superscript', label: 'Superscript' },
  { value: 'subscript', label: 'Subscript' }
];

const FormulaEssay = ({ view, previewTab, item, testItem, setQuestionData, smallSize }) => {
  const Wrapper = testItem ? EmptyWrapper : Paper;
  const [lines, setLines] = useState([
    { text: '', type: item.ui_style.default_mode, index: uuidv4() }
  ]);

  const handleItemChange = (prop, data) => {
    const newItem = cloneDeep(item);

    newItem[prop] = data;
    setQuestionData(newItem);
  };

  const handleAddOption = () => {
    const newItem = cloneDeep(item);
    newItem.ui_style.text_formatting_options.push('');
    setQuestionData(newItem);
  };

  const onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const newData = cloneDeep(item);
    newData.ui_style.text_formatting_options = arrayMove(
      newData.ui_style.text_formatting_options,
      oldIndex,
      newIndex
    );
    setQuestionData(newData);
  };

  const handleDeleteQuestion = (index) => {
    const newItem = cloneDeep(item);
    newItem.ui_style.text_formatting_options.splice(index, 1);
    setQuestionData(newItem);
  };

  const handleQuestionsChange = (index, value) => {
    console.log(index, value);
    const newData = cloneDeep(item);
    newData.ui_style.text_formatting_options[index] = value;
    setQuestionData(newData);
  };

  return (
    <Fragment>
      {view === EDIT && (
        <Fragment>
          <Paper style={{ marginBottom: 30 }}>
            <Subtitle>Compose question</Subtitle>
            <QuestionTextArea
              placeholder="Enter question"
              onChange={stimulus => handleItemChange('stimulus', stimulus)}
              value={item.stimulus}
            />
            <Subtitle>Text formatting options</Subtitle>
            <TypedList
              columns={2}
              buttonText="Add"
              selectData={selectData}
              type={typedListTypes.SELECT}
              onAdd={handleAddOption}
              items={item.ui_style.text_formatting_options}
              onSortEnd={onSortOrderListEnd}
              onRemove={handleDeleteQuestion}
              onChange={handleQuestionsChange}
            />
          </Paper>
          <FormulaEssayOptions onChange={handleItemChange} item={item} />
        </Fragment>
      )}
      {view === PREVIEW && (
        <Wrapper style={{ height: '100%' }}>
          <FormulaEssayPreview
            lines={lines}
            setLines={setLines}
            type={previewTab}
            item={item}
            smallSize={smallSize}
          />
        </Wrapper>
      )}
    </Fragment>
  );
};

FormulaEssay.propTypes = {
  previewTab: PropTypes.string,
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  testItem: PropTypes.bool,
  smallSize: PropTypes.bool
};

FormulaEssay.defaultProps = {
  previewTab: CLEAR,
  item: {},
  testItem: false,
  smallSize: false
};

const enhance = compose(
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

export default enhance(FormulaEssay);
