import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { get } from "lodash";
import stripTags from "striptags";

import { Paper, Stimulus, FlexContainer, InstructorStimulus, FroalaEditor } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { Toolbar } from "../../styled/Toolbar";
import { Item } from "../../styled/Item";
import { PREVIEW, ON_LIMIT, ALWAYS } from "../../constants/constantsForQuestions";

import { ValidList, qlToFroalaMapping } from "./constants/validList";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";
import { Addon } from "../ShortText/styled/Addon";
import CharacterMap from "../../components/CharacterMap";

const getToolBarButtons = item =>
  (item.formatting_options || [])
    .filter(x => x.active)
    .map(x => {
      const key = `${x.value}${x.param ? x.param : ""}`;
      if (qlToFroalaMapping[key]) {
        return qlToFroalaMapping[key];
      }
      return key;
    });

const EssayRichTextPreview = ({
  col,
  view,
  saveAnswer,
  t,
  item,
  smallSize,
  userAnswer,
  theme,
  showQuestionNumber,
  qIndex,
  testItem,
  location,
  previewTab
}) => {
  const toolbarButtons = getToolBarButtons(item);

  const [showCharacters, setShowCharacters] = useState(false);
  const [text, setText] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const minHeight = get(item, "ui_style.min_height", 200);
  const maxHeight = get(item, "ui_style.max_height", 300);

  const characterMap = get(item, "character_map", []);

  const [wordCount, setWordCount] = useState(
    Array.isArray(userAnswer)
      ? 0
      : typeof userAnswer === "string"
      ? userAnswer.split(" ").filter(i => !!i.trim()).length
      : 0
  );

  useEffect(() => {
    if (Array.isArray(userAnswer) || typeof userAnswer !== "string") {
      setText("");
      saveAnswer("");
      setWordCount(0);
    }
  }, [userAnswer]);

  // TODO: if this is slooooooow, debounce or throttle it..
  const handleTextChange = val => {
    if (typeof val === "string") {
      const wordsCount =
        typeof val === "string"
          ? stripTags(val)
              .split(" ")
              .filter(i => !!i.trim()).length
          : 0;
      const mathInputCount = typeof val === "string" ? (val.match(/input__math/g) || []).length : 0;
      setWordCount(wordsCount + mathInputCount);
      setText(val);
      saveAnswer(val);
    }
  };

  const handleCharacterSelect = char => {
    const newText = text.slice(0, selection.start) + char + text.slice(selection.end);

    setText(newText);
    saveAnswer(newText);

    setSelection({
      start: selection.start + char.length,
      end: selection.start + char.length
    });
  };

  const showLimitAlways = item.show_word_limit === ALWAYS;

  const showOnLimit = item.show_word_limit === ON_LIMIT;

  const displayWordCount =
    (showOnLimit && item.max_word < wordCount) || showLimitAlways
      ? `${wordCount} / ${item.max_word} ${t("component.essayText.wordsLimitTitle")}`
      : `${wordCount} ${t("component.essayText.wordsTitle")}`;

  const wordCountStyle =
    (showLimitAlways || showOnLimit) && item.max_word < wordCount
      ? { color: theme.widgets.essayRichText.wordCountLimitedColor }
      : {};

  const isNotItemDetailPreview = qIndex === null && testItem && !location.pathname.includes("item-detail");

  const isTestReview = qIndex !== null && testItem;

  const isV1Multipart = get(col, "isV1Multipart", false);

  const isReadOnly =
    (previewTab === "show" || isTestReview || isNotItemDetailPreview) && !location.pathname.includes("student");

  return item.id ? (
    <Paper isV1Multipart={isV1Multipart} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
      </QuestionTitleWrapper>

      <div style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          {!!characterMap.length && <Addon onClick={() => setShowCharacters(!showCharacters)}>a</Addon>}
          {showCharacters && (
            <CharacterMap
              style={{ position: "absolute", right: 0, top: 38, zIndex: 1000 }}
              characters={characterMap}
              onSelect={handleCharacterSelect}
            />
          )}
        </div>
        {!Array.isArray(userAnswer) && (
          <FroalaEditor
            backgroundColor={
              item.max_word < wordCount
                ? theme.widgets.essayRichText.quillLimitedBgColor
                : theme.widgets.essayRichText.quillBgColor
            }
            heightMin={minHeight}
            heightMax={maxHeight}
            onChange={handleTextChange}
            value={userAnswer}
            spellcheck={!!item.spellcheck}
            toolbarInline={false}
            initOnClick={false}
            readOnly={isReadOnly}
            quickInsertTags={[]}
            toolbarButtons={toolbarButtons}
          />
        )}

        {item.show_word_count && (
          <Toolbar borderRadiusOnlyBottom>
            <FlexContainer />
            <Item style={wordCountStyle}>{displayWordCount}</Item>
          </Toolbar>
        )}
      </div>
    </Paper>
  ) : null;
};

EssayRichTextPreview.propTypes = {
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any,
  theme: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  location: PropTypes.any.isRequired,
  testItem: PropTypes.bool,
  qIndex: PropTypes.number,
  col: PropTypes.object
};

EssayRichTextPreview.defaultProps = {
  smallSize: false,
  userAnswer: "",
  testItem: false,
  showQuestionNumber: false,
  qIndex: null
};

const toolbarOptions = options => {
  const arrSorted = options
    .filter(ite => ite.active)
    .map(item => {
      const { value, param } = item;
      return ValidList.includes(value) ? { [value]: param } : value;
    });

  const arr = [];
  let ind = 0;

  arrSorted.forEach((item, i) => {
    if (item === "|") {
      if (arrSorted[i + 1] === "|") {
        arrSorted.splice(i + 1, 1);
      }
      arr.push(arrSorted.slice(ind, i));
      ind = i + 1;
    }
    if (i === arrSorted.length - 1 && item !== "|") {
      arr.push(arrSorted.slice(ind));
    }
  });

  return arr;
};

EssayRichTextPreview.modules = options => toolbarOptions(options);

EssayRichTextPreview.formats = [
  "header",
  "script",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align"
];

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(EssayRichTextPreview);
