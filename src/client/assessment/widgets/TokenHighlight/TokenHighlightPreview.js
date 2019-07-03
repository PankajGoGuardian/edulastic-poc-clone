import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, get } from "lodash";
import { compose } from "redux";
import styled, { withTheme } from "styled-components";

import { Paper, Stimulus, InstructorStimulus, MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from "../../constants/constantsForQuestions";
import { getFontSize } from "../../utils/helpers";

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;

const TokenHighlightPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  editCorrectAnswers,
  userAnswer,
  previewTab,
  theme,
  showQuestionNumber,
  qIndex,
  disableResponse
}) => {
  const initialArray = (item.templeWithTokens || []).map((el, i) => ({
    value: el.value,
    index: i,
    selected: !!smallSize
  }));

  const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"), true);

  const validArray =
    (item && item.validation && item.validation.valid_response && item.validation.valid_response.value) || [];

  const altArray = (item && item.validation && item.validation.alt_responses) || [];

  const [answers, setAnswers] = useState(userAnswer.length !== 0 ? userAnswer : initialArray);

  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    if (view === EDIT) {
      if (item.templeWithTokens.length === editCorrectAnswers.length) {
        setAnswers(editCorrectAnswers);
      } else {
        saveAnswer(initialArray);
      }
    }
  }, [item.templeWithTokens, editCorrectAnswers]);

  useEffect(() => {
    if (previewTab === SHOW || disableResponse) {
      if (answers.filter(answer => answer.selected).length !== 0) {
        setAnswers([
          ...validArray.filter((answer, i) => answers[i].selected === answer.selected),
          ...answers.filter((answer, i) => answer.selected && validArray[i].selected !== answer.selected)
        ]);
      } else {
        setAnswers(validArray);
      }
    } else if (previewTab === CLEAR && !isCheck) {
      if (!userAnswer.some(ans => ans.selected)) {
        saveAnswer(initialArray);
        setAnswers(initialArray);
      }
    } else if (previewTab === CLEAR && isCheck) {
      saveAnswer(userAnswer);
    }
    if (previewTab === CHECK) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  }, [previewTab]);

  useEffect(() => {
    if (userAnswer.length === 0) {
      saveAnswer(initialArray);
      setAnswers(initialArray);
    }
  }, [userAnswer]);

  const handleSelect = i => () => {
    const newAnswers = cloneDeep(answers);

    const foundedItem = newAnswers.find(elem => elem.index === i);
    foundedItem.selected = !foundedItem.selected;

    const selectedItems = newAnswers.filter(answer => answer.selected);

    if (item.max_selection && selectedItems.length > item.max_selection) {
      return;
    }

    setAnswers(newAnswers);
    saveAnswer(newAnswers);
  };

  const validate = () => {
    const resultArray = new Set(validArray);

    altArray.forEach(el => {
      el.value.forEach(ans => {
        resultArray.add(ans);
      });
    });

    return [...resultArray];
  };

  const smallSizeStyles = {
    fontSize: smallSize
      ? theme.widgets.tokenHighlight.previewSmallFontSize
      : theme.widgets.tokenHighlight.previewFontSize,
    lineHeight: smallSize ? "18px" : "28px"
  };

  const getClass = index =>
    answers.find(elem => elem.index === index) && answers.find(elem => elem.index === index).selected
      ? "active-word token answer"
      : "token answer";

  const preview = previewTab === CHECK || previewTab === SHOW || smallSize;

  const rightAnswers = validate();

  const getStyles = index => {
    const defaultAnswers = disableResponse ? validArray : answers;
    const condition =
      defaultAnswers.find(elem => elem.index === index) && defaultAnswers.find(elem => elem.index === index).selected;

    let resultStyle;

    if (condition && !!rightAnswers.find(el => el.index === index && el.selected)) {
      resultStyle = {
        background: theme.widgets.tokenHighlight.correctResultBgColor,
        borderColor: theme.widgets.tokenHighlight.correctResultBorderColor
      };
    } else if (condition) {
      resultStyle = {
        background: theme.widgets.tokenHighlight.incorrectResultBgColor,
        borderColor: theme.widgets.tokenHighlight.incorrectResultBorderColor
      };
    } else if (previewTab === SHOW) {
      if (rightAnswers.find(el => el.index === index && el.selected)) {
        resultStyle = {
          background: theme.widgets.tokenHighlight.correctResultBgColor,
          borderColor: theme.widgets.tokenHighlight.correctResultBorderColor
        };
      } else {
        resultStyle = {};
      }
    } else {
      resultStyle = {};
    }

    return resultStyle;
  };

  return (
    <Paper
      data-cy="previewWrapper"
      style={{ fontSize, wordBreak: "break-word" }}
      padding={smallSize}
      boxShadow={smallSize ? "none" : ""}
    >
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
      </QuestionTitleWrapper>

      {item.templeWithTokens.map((el, i) =>
        el.active ? (
          <MathSpan
            onClick={!disableResponse ? handleSelect(i) : () => {}}
            dangerouslySetInnerHTML={{ __html: el.value }}
            style={preview || disableResponse ? getStyles(i) : {}}
            key={i}
            className={getClass(i)}
          />
        ) : (
          <MathSpan className="token without-cursor" dangerouslySetInnerHTML={{ __html: el.value }} key={i} />
        )
      )}
    </Paper>
  );
};

TokenHighlightPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  editCorrectAnswers: PropTypes.array,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.any,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool
};

TokenHighlightPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  editCorrectAnswers: [],
  showQuestionNumber: false,
  qIndex: null,
  disableResponse: false
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(TokenHighlightPreview);
