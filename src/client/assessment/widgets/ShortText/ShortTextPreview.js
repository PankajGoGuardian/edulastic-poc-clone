import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { get, isEmpty } from "lodash";

import { Paper, Stimulus, CorrectAnswersContainer, InstructorStimulus, QuestionNumberLabel } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { CHECK, SHOW, PREVIEW, CLEAR, CONTAINS } from "../../constants/constantsForQuestions";

import { SmallContainer } from "./styled/SmallContainer";
import { SmallStim } from "./styled/SmallStim";
import { getSpellCheckAttributes, getFontSize } from "../../utils/helpers";
import { Addon } from "./styled/Addon";
import CharacterMap from "../../components/CharacterMap";
import { InputWrapper } from "./styled/InputWrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

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
  qIndex,
  evaluation
}) => {
  const [text, setText] = useState(Array.isArray(userAnswer) ? "" : userAnswer);
  const [showCharacterMap, setShowCharacterMap] = useState(false);
  const [selection, setSelection] = useState(null);

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

  const handleTextChange = e => {
    const val = e.target.value;
    setText(val);
    saveAnswer(val);
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

  const style = {
    paddingRight: 35,
    fontSize: getFontSize(get(item, "uiStyle.fontsize")),
    ...(preview
      ? evaluation
        ? { background: theme.widgets.shortText.correctInputBgColor }
        : { background: theme.widgets.shortText.incorrectInputBgColor }
      : {})
  };

  const isCharacterMap = Array.isArray(item.characterMap) && !!item.characterMap.length;

  return (
    <Paper padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructorStimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
      </QuestionTitleWrapper>

      {smallSize && (
        <SmallContainer>
          <SmallStim bold>{t("component.shortText.smallSizeTitle")}</SmallStim>

          <SmallStim>{t("component.shortText.smallSizePar")}</SmallStim>
        </SmallContainer>
      )}

      <InputWrapper>
        <Input
          style={style}
          value={text}
          disabled={disableResponse}
          onChange={handleTextChange}
          onSelect={handleSelect}
          placeholder={item.placeholder || ""}
          type={get(item, "uiStyle.input_type", "text")}
          size="large"
          {...getSpellCheckAttributes(item.spellcheck)}
        />
        {isCharacterMap && <Addon onClick={() => setShowCharacterMap(!showCharacterMap)}>á</Addon>}
        {isCharacterMap && showCharacterMap && (
          <CharacterMap
            characters={item.characterMap}
            onSelect={char => {
              setSelection({
                start: selection.start + char.length,
                end: selection.start + char.length
              });
              setText(text.slice(0, selection.start) + char + text.slice(selection.end));
            }}
            style={{ position: "absolute", right: 0 }}
          />
        )}
      </InputWrapper>

      {previewTab === SHOW && (
        <>
          <CorrectAnswersContainer title={t("component.shortText.correctAnswers")}>
            {item.validation.validResponse.value}
          </CorrectAnswersContainer>
          {!isEmpty(item.validation.altResponses) && (
            <CorrectAnswersContainer title={t("component.shortText.alternateAnswers")}>
              {item.validation.altResponses.map((altAnswer, i) => {
                return (
                  <div key={i}>
                    <span>Alternate Answer {i + 1} : </span>
                    {altAnswer.value}
                  </div>
                );
              })}
            </CorrectAnswersContainer>
          )}
        </>
      )}
    </Paper>
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
