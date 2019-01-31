import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { QuestionTextArea, Subtitle } from '../common';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import MathFormulaPreview from './MathFormulaPreview';
import MathFormulaOptions from './MathFormulaOptions';
import MathFormulaAnswers from './MathFormulaAnswers';
import { MathInput } from './common';
import { CLEAR, PREVIEW, EDIT } from '../../constants/constantsForQuestions';
import { checkAnswerAction } from '../../../../author/src/actions/testItem';

const EmptyWrapper = styled.div``;

const MathFormula = ({
  view,
  testItem,
  previewTab,
  item,
  evaluation,
  setQuestionData,
  saveAnswer,
  smallSize
}) => {
  const Wrapper = testItem ? EmptyWrapper : Paper;
  const [studentTemplate, setStudentTemplate] = useState();

  const setTemplate = (template) => {
    setStudentTemplate(template.replace(/\\embed\{response\}/g, '\\MathQuillMathField{}'));
  };

  useEffect(
    () => {
      setTemplate(item.template);
    },
    [item.template]
  );

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
      {view === EDIT && (
        <Fragment>
          <Paper style={{ marginBottom: 30 }}>
            <Subtitle>Compose question</Subtitle>
            <QuestionTextArea
              placeholder="Enter question"
              onChange={stimulus => handleItemChangeChange('stimulus', stimulus)}
              value={item.stimulus}
            />
            <Subtitle>Template</Subtitle>
            <MathInput
              showResponse
              symbols={item.symbols}
              numberPad={item.numberPad}
              value={item.template}
              onInput={(latex) => {
                handleUpdateTemplate(latex);
                setTemplate(latex);
              }}
            />
            <MathFormulaAnswers item={item} setQuestionData={setQuestionData} />
          </Paper>
          <MathFormulaOptions
            onChange={handleItemChangeChange}
            uiStyle={item.ui_style}
            item={item}
            responseContainers={item.response_containers}
            textBlocks={item.text_blocks}
            stimulusReview={item.stimulus_review}
            instructorStimulus={item.instructor_stimulus}
            metadata={item.metadata}
          />
        </Fragment>
      )}
      {view === PREVIEW && (
        <Wrapper style={{ height: '100%', overflow: 'visible' }}>
          <MathFormulaPreview
            type={previewTab}
            studentTemplate={studentTemplate}
            item={item}
            saveAnswer={saveAnswer}
            evaluation={evaluation}
            smallSize={smallSize}
          />
        </Wrapper>
      )}
    </Fragment>
  );
};

MathFormula.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object,
  evaluation: PropTypes.any.isRequired,
  smallSize: PropTypes.bool
};

MathFormula.defaultProps = {
  previewTab: CLEAR,
  testItem: false,
  item: {},
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

export default enhance(MathFormula);
