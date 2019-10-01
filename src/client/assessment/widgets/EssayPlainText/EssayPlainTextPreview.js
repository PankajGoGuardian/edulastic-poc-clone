import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { get } from "lodash";

import { Paper, Stimulus, FlexContainer, InstructorStimulus, QuestionNumberLabel } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { COPY, CUT, PASTE, ON_LIMIT, ALWAYS, PREVIEW } from "../../constants/constantsForQuestions";

import { Toolbar } from "../../styled/Toolbar";
import { Item } from "../../styled/Item";

import { ToolbarItem } from "./styled/ToolbarItem";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import { preventEvent, getFontSize, getSpellCheckAttributes } from "../../utils/helpers";
import Character from "./components/Character";

const EssayPlainTextPreview = ({
  col,
  view,
  saveAnswer,
  t,
  item,
  smallSize,
  userAnswer,
  theme,
  showQuestionNumber,
  location,
  testItem,
  qIndex,
  disableResponse
}) => {
  const [text, setText] = useState(Array.isArray(userAnswer) ? "" : userAnswer);

  const [wordCount, setWordCount] = useState(text.split(" ").filter(i => !!i).length);

  const [selection, setSelection] = useState(null);

  const [buffer, setBuffer] = useState("");

  let node;

  useEffect(() => {
    if (Array.isArray(userAnswer)) {
      setText("");
      saveAnswer("");
      setWordCount(0);
    } else {
      setText(userAnswer);
    }
  }, [userAnswer]);

  const handleTextChange = e => {
    const val = e.target.value;
    if (typeof val === "string") {
      setText(val);
      setWordCount(val.split(" ").filter(i => !!i).length);
      saveAnswer(val);
    }
  };

  const handleSelect = () => {
    if (node.textAreaRef.selectionStart !== node.textAreaRef.selectionEnd) {
      setSelection({
        start: node.textAreaRef.selectionStart,
        end: node.textAreaRef.selectionEnd
      });
    } else {
      setSelection(null);
    }

    setSelection({
      start: node.textAreaRef.selectionStart,
      end: node.textAreaRef.selectionEnd
    });
  };

  const handleAction = action => () => {
    switch (action) {
      case COPY:
        if (selection) {
          setBuffer(text.slice(selection.start, selection.end));
        }
        break;
      case CUT: {
        if (selection) {
          setBuffer(text.slice(selection.start, selection.end));
          setText(text.slice(0, selection.start) + text.slice(selection.end));
        }
        break;
      }
      case PASTE: {
        let val = "";
        if (selection.end) {
          val = text.slice(0, selection.start) + buffer + text.slice(selection.end);
          setText(val);
        } else {
          val = text.slice(0, selection.start) + buffer + text.slice(selection.start);
          setText(val);
        }
        !disableResponse && saveAnswer(val);
        break;
      }
      default:
        break;
    }
  };

  const showLimitAlways = item.showWordLimit === ALWAYS;

  const showOnLimit = item.showWordLimit === ON_LIMIT;

  const displayWordCount =
    (showOnLimit && item.maxWord < wordCount) || showLimitAlways
      ? `${wordCount} / ${item.maxWord} ${t("component.essayText.wordsLimitTitle")}`
      : `${wordCount} ${t("component.essayText.wordsTitle")}`;

  const wordCountStyle =
    (showLimitAlways || showOnLimit) && item.maxWord < wordCount
      ? { color: theme.widgets.essayPlainText.wordCountLimitedColor }
      : {};

  const minHeight = get(item, "uiStyle.minHeight", "inherit");
  const maxHeight = get(item, "uiStyle.max_height", "inherit");
  const isV1Multipart = get(col, "isV1Multipart", false);
  const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));

  return (
    <Paper isV1Multipart={isV1Multipart} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructorStimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
      </QuestionTitleWrapper>

      <Toolbar borderRadiusOnlyTop style={{ borderBottom: 0 }}>
        <FlexContainer childMarginRight={0} alignItems="stretch" justifyContent="space-between">
          {item.showCopy && <ToolbarItem onClick={handleAction(COPY)}>{t("component.essayText.copy")}</ToolbarItem>}
          {item.showCut && <ToolbarItem onClick={handleAction(CUT)}>{t("component.essayText.cut")}</ToolbarItem>}
          {item.showPaste && <ToolbarItem onClick={handleAction(PASTE)}>{t("component.essayText.paste")}</ToolbarItem>}
          {Array.isArray(item.characterMap) && (
            <Character
              onSelect={char => {
                setSelection({
                  start: selection.start + char.length,
                  end: selection.start + char.length
                });
                setText(text.slice(0, selection.start) + char + text.slice(selection.end));
              }}
              characters={item.characterMap}
            />
          )}
        </FlexContainer>
      </Toolbar>

      <Input.TextArea
        ref={ref => {
          node = ref;
        }}
        style={{
          borderRadius: 0,
          minHeight,
          maxHeight,
          fontSize,
          background:
            item.maxWord < wordCount
              ? theme.widgets.essayPlainText.textInputLimitedBgColor
              : theme.widgets.essayPlainText.textInputBgColor
        }}
        rows={4}
        onSelect={handleSelect}
        value={smallSize ? t("component.essayText.plain.templateText") : text}
        onChange={handleTextChange}
        size="large"
        onPaste={preventEvent}
        readOnly={disableResponse}
        onCopy={preventEvent}
        onCut={preventEvent}
        placeholder={item.placeholder || ""}
        {...getSpellCheckAttributes(item.spellcheck)}
      />

      {item.showWordCount && (
        <Toolbar borderRadiusOnlyBottom style={{ borderTop: 0 }}>
          <FlexContainer alignItems="stretch" justifyContent="space-between" />

          <Item style={wordCountStyle}>{displayWordCount}</Item>
        </Toolbar>
      )}
    </Paper>
  );
};

EssayPlainTextPreview.propTypes = {
  col: PropTypes.object,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
  location: PropTypes.any.isRequired,
  testItem: PropTypes.bool,
  qIndex: PropTypes.number,
  theme: PropTypes.object.isRequired
};

EssayPlainTextPreview.defaultProps = {
  smallSize: false,
  testItem: false,
  showQuestionNumber: false,
  qIndex: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(EssayPlainTextPreview);
