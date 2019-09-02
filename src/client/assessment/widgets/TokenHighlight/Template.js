import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
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

import { getInitialArray, getParagraphsArray, getSentencesArray, getWordsArray, getCustomArray } from "./helpers";

class Template extends Component {
  render() {
    const {
      item,
      setQuestionData,
      template,
      setTemplate,
      templateTab,
      setTemplateTab,
      t,
      fillSections,
      cleanSections
    } = this.props;
    const mode = item.tokenization;

    const handleItemChangeChange = (prop, propData) => {
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

    const handleCustomTokenize = () => {
      const newTemplate = cloneDeep(template);
      if (mode === CUSTOM_MODE) {
        let userSelection;
        if (window.getSelection) {
          userSelection = window.getSelection();
        } else {
          userSelection = document.createRange();
        }

        const selection = userSelection.getRangeAt(0);
        console.log(selection);
        // console.log(selection, newTemplate);
        //
        // const { endOffset, startOffset } = selection;

        // if (endOffset === startOffset) {
        //   console.log("select text!!!");
        //   return;
        // }
        // const allText = newTemplate[i].value;
        // const t1 = allText.slice(0, startOffset);
        // const t2 = allText.slice(startOffset, endOffset);
        // const t3 = allText.slice(endOffset, allText.length);
        // const newTokenArray = [];
        // newTokenArray[0] = {
        //   value: t1,
        //   active: false
        // };
        // newTokenArray[1] = {
        //   value: t2,
        //   active: true
        // };
        // newTokenArray[2] = {
        //   value: t3,
        //   active: false
        // };

        // newTemplate.splice(i, 1, ...newTokenArray);

        // setQuestionData(
        //   produce(item, draft => {
        //     draft.templeWithTokens = newTemplate;
        //     setTemplate(newTemplate);
        //     updateVariables(draft);
        //   })
        // );
      }
    };

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
              onChange={val => handleItemChangeChange("template", val)}
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
                  onClick={() => handleItemChangeChange("tokenization", PARAGRAPH_MODE)}
                  type="button"
                >
                  {t("component.tokenHighlight.paragraph")}
                </ModeButton>
                <ModeButton
                  active={mode === SENTENCE_MODE}
                  onClick={() => handleItemChangeChange("tokenization", SENTENCE_MODE)}
                  type="button"
                >
                  {t("component.tokenHighlight.sentence")}
                </ModeButton>
                <ModeButton
                  active={mode === WORD_MODE}
                  onClick={() => handleItemChangeChange("tokenization", WORD_MODE)}
                  type="button"
                >
                  {t("component.tokenHighlight.word")}
                </ModeButton>
                <ModeButton
                  active={mode === CUSTOM_MODE}
                  onClick={() => handleItemChangeChange("tokenization", CUSTOM_MODE)}
                  type="button"
                >
                  {t("component.tokenHighlight.custom")}
                </ModeButton>
              </Container>
              <div onMouseUp={handleCustomTokenize}>
                {template.map((el, i) => (
                  <MathSpan
                    onClick={handleTemplateClick(i)}
                    selectableText={mode === CUSTOM_MODE}
                    dangerouslySetInnerHTML={{ __html: el.value }}
                    key={i}
                    className={el.active ? `active-word token ${mode}` : "token"}
                  />
                ))}
              </div>
            </Fragment>
          ) : null}
        </Question>
      </TemplateWrapper>
    );
  }
}

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
