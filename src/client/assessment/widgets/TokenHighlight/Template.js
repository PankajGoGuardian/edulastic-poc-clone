import React, { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { message } from "antd";
import { cloneDeep } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { Tabs, Tab, MathSpan } from "@edulastic/common";

import { WORD_MODE, PARAGRAPH_MODE, SENTENCE_MODE, CUSTOM_MODE } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";
import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import { Container } from "./styled/Container";
import { ModeButton } from "./styled/ModeButton";
import { TemplateWrapper } from "./styled/TemplateWrapper";

import {
  getInitialArray,
  getParagraphsArray,
  getSentencesArray,
  getWordsArray,
  getCustomArray,
  getCustomTokenTemplate,
  removeTokenFromHtml
} from "./helpers";

const Template = ({
  item,
  setQuestionData,
  template,
  setTemplate,
  templateTab,
  setTemplateTab,
  t,
  fillSections,
  cleanSections
}) => {
  const mode = item.tokenization;
  const containerRef = useRef();
  const [customTokenCount, updateCount] = useState(0);

  const handleItemChange = (prop, propData) => {
    setQuestionData(
      produce(item, draft => {
        if (prop === "template") {
          let resultArray = "";
          const initialArray = getInitialArray(propData);
          if (mode === WORD_MODE) {
            resultArray = getWordsArray(initialArray);
          } else if (mode === PARAGRAPH_MODE) {
            resultArray = getParagraphsArray(initialArray);
          } else if (mode === CUSTOM_MODE) {
            resultArray = getCustomArray(initialArray);
          } else {
            resultArray = getSentencesArray(initialArray);
          }
          setTemplate(resultArray);
        }

        draft[prop] = propData;
        updateVariables(draft);
      })
    );
  };

  const handleTemplateClick = i => () => {
    const newTemplate = cloneDeep(template);
    if (mode !== CUSTOM_MODE) {
      setQuestionData(
        produce(item, draft => {
          newTemplate[i].active = !newTemplate[i].active;

          draft.templeWithTokens = newTemplate;

          setTemplate(newTemplate);
          updateVariables(draft);
        })
      );
    }
  };

  const getSelected = () => {
    let sel = "";
    if (window.getSelection) {
      sel = window.getSelection();
    } else if (document.getSelection) {
      sel = document.getSelection();
    } else if (document.selection) {
      sel = document.selection.createRange();
    }
    return sel;
  };

  const clearSelection = () => {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  // if element is custom token, this will return true.
  const isCustomToken = elem => elem.className === "token active-word" && !!elem.getAttribute("sequence");

  const removeCustomToken = elem => {
    if (!isCustomToken(elem)) {
      return;
    }
    const tokenIndex = parseInt(elem.getAttribute("sequence"), 10);
    setQuestionData(
      produce(item, draft => {
        const prevToken = draft.templeWithTokens[tokenIndex - 1] || {};
        const nextToken = draft.templeWithTokens[tokenIndex + 1] || {};
        const currentToken = draft.templeWithTokens[tokenIndex] || {};

        const newTokenValue = `${prevToken.value || ""}${currentToken.value || ""}${nextToken.value || ""}`;
        draft.templeWithTokens.splice(tokenIndex - 1, 3, {
          value: newTokenValue,
          active: false
        });
      })
    );
  };

  const handleCustomTokenize = () => {
    const selection = getSelected();
    const range = selection.getRangeAt(0);
    const { endContainer, endOffset, startContainer, startOffset } = range;
    if (startOffset === endOffset) {
      clearSelection();
      return;
    }

    if (
      (endContainer && endContainer.parentNode.className === "token active-word") ||
      (startContainer && startContainer.parentNode.className === "token active-word")
    ) {
      message.error("You are highlighting already selected text. Please select a distinct text and try again.");
      clearSelection();
      return;
    }
    try {
      const newNode = document.createElement("span");
      newNode.setAttribute("class", "token active-word");
      range.surroundContents(newNode);
      clearSelection();
      updateCount(customTokenCount + 1);
    } catch (err) {
      message.error("Something went wrong. Please select a text and try again.");
      clearSelection();
    }
  };

  const handleCustomTokenClick = e => removeCustomToken(e.target);

  const customTokenTemplate = getCustomTokenTemplate(item.templeWithTokens);

  useEffect(() => {
    if (containerRef.current) {
      const { childNodes } = containerRef.current;
      const tokens = [];
      let _token = "";
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === 3) {
          _token += childNodes[i].textContent;
        } else if (childNodes[i].nodeName === "BR") {
          _token += "<br/>";
        } else if (childNodes[i].nodeName === "SPAN" && childNodes[i].className === "token active-word") {
          tokens.push({ value: _token, active: false });
          _token = "";
          // this case is overlapping
          const value = removeTokenFromHtml(childNodes[i].innerHTML);
          tokens.push({ value, active: true });
        } else {
          _token += childNodes[i].outerHTML;
        }
      }
      tokens.push({ value: _token, active: false });
      setQuestionData(
        produce(item, draft => {
          draft.templeWithTokens = tokens;
        })
      );
    }
  }, [customTokenCount]);

  return (
    <TemplateWrapper>
      <Question
        section="main"
        label={t("component.tokenHighlight.templateTitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.tokenHighlight.templateTitle")}</Subtitle>
        <Tabs style={{ marginBottom: 15 }} value={templateTab} onChange={setTemplateTab}>
          <Tab label={t("component.tokenHighlight.editTemplateTab")} />
          <Tab label={t("component.tokenHighlight.editTokenTab")} />
        </Tabs>

        {templateTab === 0 && (
          <QuestionTextArea
            onChange={val => handleItemChange("template", val)}
            value={item.template}
            toolbarId="tokens-template"
            border="border"
          />
        )}

        {templateTab === 1 ? (
          <Fragment>
            <Container>
              <ModeButton
                active={mode === PARAGRAPH_MODE}
                onClick={() => handleItemChange("tokenization", PARAGRAPH_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.paragraph")}
              </ModeButton>
              <ModeButton
                active={mode === SENTENCE_MODE}
                onClick={() => handleItemChange("tokenization", SENTENCE_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.sentence")}
              </ModeButton>
              <ModeButton
                active={mode === WORD_MODE}
                onClick={() => handleItemChange("tokenization", WORD_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.word")}
              </ModeButton>
              <ModeButton
                active={mode === CUSTOM_MODE}
                onClick={() => handleItemChange("tokenization", CUSTOM_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.custom")}
              </ModeButton>
            </Container>
            {mode === CUSTOM_MODE && (
              <MathSpan
                onMouseUp={handleCustomTokenize}
                onClick={handleCustomTokenClick}
                selectableText
                dangerouslySetInnerHTML={{
                  __html: customTokenTemplate
                }}
                className="token"
                innerRef={containerRef}
              />
            )}
            {mode !== CUSTOM_MODE &&
              template.map((el, i) => (
                <MathSpan
                  onClick={handleTemplateClick(i)}
                  dangerouslySetInnerHTML={{ __html: el.value }}
                  key={i}
                  className={el.active ? `active-word token ${mode}` : "token"}
                />
              ))}
          </Fragment>
        ) : null}
      </Question>
    </TemplateWrapper>
  );
};

Template.propTypes = {
  item: PropTypes.object.isRequired,
  template: PropTypes.object.isRequired,
  templateTab: PropTypes.number.isRequired,
  setTemplateTab: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Template);
