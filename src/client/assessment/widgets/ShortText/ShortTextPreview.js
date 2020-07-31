import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { compose } from "redux";
import styled, { withTheme } from "styled-components";
import { get, isEmpty } from "lodash";

import {
  Stimulus,
  CorrectAnswersContainer,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  TextInputStyled
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { CHECK, SHOW, PREVIEW, CLEAR, EDIT } from "../../constants/constantsForQuestions";
import Instructions from "../../components/Instructions";
import { SmallContainer } from "./styled/SmallContainer";
import { SmallStim } from "./styled/SmallStim";
import { getSpellCheckAttributes } from "../../utils/helpers";
import { Addon } from "./styled/Addon";
import CharacterMap from "../../components/CharacterMap";
import { InputWrapper } from "./styled/InputWrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { StyledPaperWrapper } from "../../styled/Widget";

const ShortTextPreview = ({
  view,
  saveAnswer,
  t,
  item,
  previewTab,
  smallSize,
  userAnswer,
  theme,
  disableResponse,
  showQuestionNumber,
  evaluation,
  isPrintPreview
}) => {
  const [text, setText] = useState(Array.isArray(userAnswer) ? "" : userAnswer);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputType = get(item, "uiStyle.input_type", "text");

  useEffect(() => {
    if (Array.isArray(userAnswer)) {
      setText("");
      /**
       * to display already enetered user response
       */
    } else if (typeof userAnswer === "string" && userAnswer) {
      setText(userAnswer);
    }
  }, [userAnswer]);

  useEffect(() => {
    saveAnswer(text);
  }, [text]);

  const handleTextChange = e => {
    const val = e.target.value;
    setText(val);
  };

  const handleSelect = e => {
    const { selectionStart, selectionEnd } = e.target;

    if (selectionStart !== selectionEnd) {
      setSelection({
        start: selectionStart,
        end: selectionEnd
      });
    } else {
      setSelection(null);
    }

    setSelection({
      start: selectionStart,
      end: selectionEnd
    });
  };

  const preview = previewTab === CHECK || previewTab === SHOW;
  let background; // no background highlights initially
  if (text.length && preview) {
    if (evaluation === true) {
      background = theme.checkbox.rightBgColor;
    } else {
      background = theme.checkbox.wrongBgColor;
    }
  }

  if (isPrintPreview) {
    background = "transparent";
  }

  const isCharacterMap = Array.isArray(item.characterMap) && !!item.characterMap.length;

  return (
    <StyledPaperWrapper padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <FlexContainer justifyContent="flex-start" alignItems="baseline">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>
        <QuestionContentWrapper>
          <QuestionTitleWrapper>
            {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
          </QuestionTitleWrapper>
          {smallSize && (
            <SmallContainer>
              <SmallStim bold>{t("component.shortText.smallSizeTitle")}</SmallStim>

              <SmallStim>{t("component.shortText.smallSizePar")}</SmallStim>
            </SmallContainer>
          )}

          <InputWrapper>
            <TextInputStyled
              value={text}
              pr="35px"
              bg={background}
              noBorder={preview}
              disabled={disableResponse}
              onChange={handleTextChange}
              onSelect={handleSelect}
              placeholder={item.placeholder || ""}
              type={inputType}
              {...getSpellCheckAttributes(item.spellcheck)}
            />
            {isCharacterMap && inputType === "text" && (
              <Popover
                placement="bottomLeft"
                trigger="click"
                content={
                  <CharacterMap
                    characters={item.characterMap}
                    onSelect={char => {
                      setSelection({
                        start: selection.start + char.length,
                        end: selection.start + char.length
                      });
                      setText(text.slice(0, selection.start) + char + text.slice(selection.end));
                    }}
                  />
                }
              >
                <Addon>á</Addon>
              </Popover>
            )}
          </InputWrapper>
          {view !== EDIT && <Instructions item={item} />}
          {previewTab === SHOW && (
            <>
              <CorrectAnswersContainer
                title={t("component.shortText.correctAnswers")}
                minHeight="auto"
                padding="15px 25px 20px"
              >
                <CorrectAnswers>{item?.validation?.validResponse?.value}</CorrectAnswers>
              </CorrectAnswersContainer>
              {!isEmpty(item.validation?.altResponses) && (
                <CorrectAnswersContainer
                  title={t("component.shortText.alternateAnswers")}
                  minHeight="auto"
                  padding="15px 25px 20px"
                  titleMargin="0px 0px 8px"
                >
                  <CorrectAnswers>
                    {item.validation.altResponses.map((altAnswer, i) => (
                      <div key={i}>
                        <span>Alternate Answer {i + 1} : </span>
                        {altAnswer.value}
                      </div>
                    ))}
                  </CorrectAnswers>
                </CorrectAnswersContainer>
              )}
            </>
          )}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  );
};

ShortTextPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ShortTextPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  showQuestionNumber: false,
  qIndex: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ShortTextPreview);

const CorrectAnswers = styled.div`
  padding-left: 20px;
`;
