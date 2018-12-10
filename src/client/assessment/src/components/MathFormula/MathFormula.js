import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { QuestionTextArea, Subtitle } from '../common';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import withAnswerSave from '../HOC/withAnswerSave';
import MathFormulaPreview from './MathFormulaPreview';
import MathFormulaOptions from './MathFormulaOptions';
import MathFormulaAnswers from './MathFormulaAnswers';
import { MathInput } from './common';

const EmptyWrapper = styled.div``;

const MathFormula = ({
  view,
  testItem,
  previewTab,
  item,
  setQuestionData,
  saveAnswer,
  userAnswer
}) => {
  const Wrapper = testItem ? EmptyWrapper : Paper;

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleUpdateTemplate = (val) => {
    const newItem = cloneDeep(item);
    newItem.template = val;
    setQuestionData(newItem);
  };

  return (
    <Fragment>
      {view === 'edit' && (
        <Fragment>
          <Paper style={{ marginBottom: 30 }}>
            <Subtitle>Compose question</Subtitle>
            <QuestionTextArea
              placeholder="Enter question"
              onChange={stimulus => handleItemChangeChange('stimulus', stimulus)}
              value={item.stimulus}
            />
            <Subtitle>Template</Subtitle>
            <MathInput value={item.template} onInput={handleUpdateTemplate} />
            <MathFormulaAnswers item={item} setQuestionData={setQuestionData} />
          </Paper>
          <MathFormulaOptions onChange={handleItemChangeChange} uiStyle={item.ui_style} />
        </Fragment>
      )}
      {view === 'preview' && (
        <Wrapper style={{ height: '100%' }}>
          {previewTab === 'show' && (
            <MathFormulaPreview
              type="show"
              saveAnswer={saveAnswer}
              userAnswer={userAnswer || item.template}
              item={item}
            />
          )}

          {previewTab === 'clear' && (
            <MathFormulaPreview
              type="clear"
              saveAnswer={saveAnswer}
              userAnswer={userAnswer || item.template}
              item={item}
            />
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

MathFormula.propTypes = {
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object
};

MathFormula.defaultProps = {
  previewTab: 'clear',
  testItem: false,
  item: {},
  userAnswer: ''
};

const enhance = compose(
  withAnswerSave,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(MathFormula);
