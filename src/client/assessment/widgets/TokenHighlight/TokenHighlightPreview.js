import React, { useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { cloneDeep, get } from "lodash";
import { compose } from "redux";
import produce from "immer";
import styled, { withTheme } from "styled-components";

import {
  Stimulus,
  MathSpan,
  CorrectAnswersContainer,
  QuestionNumberLabel,
  AnswerContext,
  FlexContainer,
  QuestionSubLabel,
  QuestionContentWrapper,
  QuestionLabelWrapper
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import Instructions from "../../components/Instructions";
import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from "../../constants/constantsForQuestions";
import { getFontSize } from "../../utils/helpers";
import { StyledPaperWrapper } from "../../styled/Widget";

const QuestionTitleWrapper = styled.div`
  display: flex;
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
  disableResponse,
  mode,
  t
}) => {
  const answerContextConfig = useContext(AnswerContext);
  const { expressGrader, isAnswerModifiable } = answerContextConfig;
  const isExpressGrader = previewTab === SHOW && expressGrader;

  const templeWithTokens = useMemo(() => item.templeWithTokens || [], [item.templeWithTokens]);

  const initialArray = templeWithTokens.map((el, i) => ({
    value: el.value,
    index: i,
    selected: !!smallSize
  }));

  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"), true);

  const resp = item?.validation?.validResponse?.value || [];
  const validArray = resp.length ? resp : initialArray;

  const altArray = (item && item.validation && item.validation.altResponses) || [];

  const [answers, setAnswers] = useState(userAnswer.length !== 0 ? userAnswer : initialArray);

  const [isCheck, setIsCheck] = useState(false);

  const [mergedTokens, setMergedTokens] = useState(templeWithTokens);

  useEffect(() => {
    if (view === EDIT) {
      if (templeWithTokens.length === editCorrectAnswers.length) {
        setAnswers(editCorrectAnswers);
      } else {
        saveAnswer(initialArray);
      }
    }
    const _mergedTokens = templeWithTokens.reduce((acc, currItem, currentIndex) => {
      const tokens = templeWithTokens;
      const prevIndex = currentIndex - 1;
      const currentAccIndex = acc.length - 1;
      const lastAccItem = acc[currentAccIndex];
      const prevItem = tokens[prevIndex];

      if (get(currItem, "active", false) && get(prevItem, "active", false)) {
        // current and previous item active, merge it with and update the destination array
        const mergedItem = {
          ...currItem,
          value: `${lastAccItem.value}${currItem.value}`,
          active: true,
          mergeIndex: currentIndex
        };
        acc.splice(currentAccIndex, 1);
        acc.push(mergedItem);
      } else if (
        get(currItem, "active", false) &&
        !get(prevItem, "active", false) &&
        get(lastAccItem, "mergeIndex", undefined) !== prevIndex
      ) {
        // disconnected current active, previouse not
        acc.push(currItem);
      } else if (
        !get(currItem, "active", false) &&
        !get(prevItem, "active", false) &&
        get(lastAccItem, "mergeIndex", undefined) !== prevIndex
      ) {
        // disconnected current and previous not active
        acc.push(currItem);
      } else if (
        !get(currItem, "active", false) &&
        get(prevItem, "active", false) &&
        get(lastAccItem, "mergeIndex", undefined) !== prevIndex
      ) {
        // disconnected current not active, previous active
        acc.push(currItem);
      } else if (
        get(lastAccItem, "mergeIndex", undefined) === prevIndex &&
        (get(currItem, "active", false) || !get(currItem, "active", false))
      ) {
        // disconnected current active, previous not active special case
        acc.push(currItem);
      }

      return acc;
    }, []);

    setMergedTokens(_mergedTokens);
  }, [templeWithTokens, editCorrectAnswers]);

  useEffect(() => {
    if (previewTab === SHOW || disableResponse) {
      if (answers && answers.filter(answer => answer.selected)?.length !== 0) {
        setAnswers([
          ...validArray.filter((answer, i) => answers[i]?.selected === answer.selected),
          ...answers.filter((answer, i) => answer.selected && validArray[i]?.selected !== answer.selected)
        ]);
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
    if (view === EDIT && !isCheck) {
      setAnswers(validArray);
    }
  }, [userAnswer]);

  const handleSelect = i => () => {
    const newAnswers = cloneDeep(answers);
    const foundedItem = newAnswers.find(elem => elem.index === i);
    if (foundedItem) foundedItem.selected = !foundedItem.selected;

    const selectedItems = newAnswers.filter(answer => answer.selected);

    if (item.maxSelection && selectedItems.length > item.maxSelection) {
      return;
    }

    setAnswers(newAnswers);
    saveAnswer(newAnswers, true);
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

  const getClass = index =>
    answers.find(elem => elem.index === index) && answers.find(elem => elem.index === index).selected
      ? "active-word token answer"
      : "token answer";

  const preview = previewTab === CHECK || previewTab === SHOW || smallSize;

  const rightAnswers = validate();

  const getStyles = (index, correctAnswers = []) => {
    const _answers = correctAnswers.length > 0 ? correctAnswers : answers;
    const condition =
      _answers.find(elem => elem.index === index) && _answers.find(elem => elem.index === index).selected;

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
    } else {
      resultStyle = {};
    }

    return resultStyle;
  };

  const tokenList = mode === "custom" ? mergedTokens : templeWithTokens;
  let allCorrectAnswers = [];

  if (item.validation) {
    allCorrectAnswers = [item.validation?.validResponse?.value];
    item.validation?.altResponses?.forEach(altAnswers => {
      allCorrectAnswers.push(altAnswers.value);
    }, []);
  }

  const getClassNameForExpressGrader = index => {
    const { selected } = userAnswer.find(elem => elem.index === index) || {};
    return selected ? "active-word token answer" : "token answer";
  };

  const getStylesForExpressGrader = index => {
    if (isAnswerModifiable) {
      return;
    }
    const { selected: con } = userAnswer.find(elem => elem.index === index) || {};
    let resultStyle = {};

    if (con && !!rightAnswers.find(el => el.index === index && el.selected)) {
      resultStyle = {
        background: theme.widgets.tokenHighlight.correctResultBgColor,
        borderColor: theme.widgets.tokenHighlight.correctResultBorderColor
      };
    } else if (con) {
      resultStyle = {
        background: theme.widgets.tokenHighlight.incorrectResultBgColor,
        borderColor: theme.widgets.tokenHighlight.incorrectResultBorderColor
      };
    } else {
      resultStyle = {};
    }

    return resultStyle;
  };

  const handleSelectForExpressGrader = tokenIndex => () => {
    saveAnswer(
      produce(userAnswer, draft => {
        let selectedItems = draft.filter(answer => answer.selected).length;
        draft.forEach(elem => {
          if (elem.index === tokenIndex) {
            if (!elem.selected) {
              selectedItems += 1;
            }
            if (selectedItems < item.maxSelection || !item.maxSelection) {
              elem.selected = !elem.selected;
            }
          }
        });
      })
    );
  };

  return (
    <StyledPaperWrapper
      data-cy="previewWrapper"
      style={{ wordBreak: "break-word" }}
      fontSize={fontSize}
      padding={smallSize}
      boxShadow={smallSize ? "none" : ""}
    >
      <FlexContainer justifyContent="flex-start" alignItems="baseline" width="100%">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>
        <QuestionContentWrapper>
          <QuestionTitleWrapper>
            {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
          </QuestionTitleWrapper>
          <div>
            {!isExpressGrader &&
              tokenList.map((el, i) =>
                el.active ? (
                  <MathSpan
                    onClick={!disableResponse ? handleSelect(i) : () => {}}
                    dangerouslySetInnerHTML={{ __html: el.value }}
                    style={preview || disableResponse ? getStyles(i, userAnswer) : {}}
                    key={i}
                    className={getClass(i)}
                  />
                ) : (
                  <MathSpan className="token without-cursor" dangerouslySetInnerHTML={{ __html: el.value }} key={i} />
                )
              )}

            {isExpressGrader &&
              tokenList.map((el, i) =>
                el.active ? (
                  <MathSpan
                    onClick={isAnswerModifiable ? handleSelectForExpressGrader(i) : () => {}}
                    dangerouslySetInnerHTML={{ __html: el.value }}
                    style={getStylesForExpressGrader(i)}
                    key={i}
                    className={getClassNameForExpressGrader(i)}
                  />
                ) : (
                  <MathSpan className="token without-cursor" dangerouslySetInnerHTML={{ __html: el.value }} key={i} />
                )
              )}
          </div>
          {view && view !== EDIT && <Instructions item={item} />}
          {previewTab === SHOW &&
            allCorrectAnswers.map((correctAnswers, correctGroupIndex) => {
              const title =
                correctGroupIndex === 0
                  ? t("component.sortList.correctAnswers")
                  : `${t("component.sortList.alternateAnswer")} ${correctGroupIndex}`;
              return (
                <div style={{ width: "100%" }}>
                  <CorrectAnswersContainer key={correctGroupIndex} title={title}>
                    {correctAnswers.map((el, i) =>
                      el.selected ? (
                        <MathSpan
                          onClick={() => {}}
                          dangerouslySetInnerHTML={{ __html: el.value }}
                          style={getStyles(i, correctAnswers)}
                          key={i}
                        />
                      ) : (
                        <MathSpan
                          className="token without-cursor"
                          dangerouslySetInnerHTML={{ __html: el.value }}
                          key={i}
                        />
                      )
                    )}
                  </CorrectAnswersContainer>
                </div>
              );
            })}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
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
  disableResponse: PropTypes.bool,
  mode: PropTypes.string,
  t: PropTypes.func.isRequired
};

TokenHighlightPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  editCorrectAnswers: [],
  showQuestionNumber: false,
  disableResponse: false,
  mode: ""
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(TokenHighlightPreview);
