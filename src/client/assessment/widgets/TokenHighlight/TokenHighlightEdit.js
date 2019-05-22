import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";

import { WORD_MODE, PARAGRAPH_MODE, EDIT } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import withPoints from "../../components/HOC/withPoints";
import CorrectAnswers from "../../components/CorrectAnswers";
import { Widget } from "../../styled/Widget";
import { ContentArea } from "../../styled/ContentArea";

import TokenHighlightPreview from "./TokenHighlightPreview";
import Options from "./components/Options";
import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";

const OptionsList = withPoints(TokenHighlightPreview);

const TokenHighlightEdit = ({ item, setQuestionData, fillSections, cleanSections, advancedAreOpen }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const [templateTab, setTemplateTab] = useState(0);

  const mode = item.tokenization;

  const initialArray = item.template.replace(/(<p>|<\/p>)*/g, "").split('<p class="newline_section"><br>');

  const paragraphsArray = initialArray.map(el => ({
    value: `${el}<br/>`,
    active: true
  }));

  const sentencesArray = initialArray
    .join("<br/>")
    .split(".")
    .map(el => ({ value: `${el}.`, active: true }))
    .filter(el => el.value !== "." && el.value.trim() && el.value !== "<br/>.");

  const wordsArray = initialArray
    .join("<br/> ")
    .split(" ")
    .map(el => ({ value: `${el}`, active: true }));

  const [template, setTemplate] = useState();

  useEffect(() => {
    setQuestionData(
      produce(item, draft => {
        if (template || draft.templeWithTokens.length === 0) {
          let resultArray = "";
          if (mode === WORD_MODE) {
            resultArray = wordsArray;
          } else if (mode === PARAGRAPH_MODE) {
            resultArray = paragraphsArray;
          } else {
            resultArray = sentencesArray;
          }

          draft.templeWithTokens = resultArray;

          setTemplate(resultArray);
        } else {
          draft.templeWithTokens = item.templeWithTokens;
          setTemplate(cloneDeep(item.templeWithTokens));
        }
        updateVariables(draft);
      })
    );
  }, [mode, item.template]);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.alt_responses) {
          draft.validation.alt_responses = [];
        }
        draft.validation.alt_responses.push({
          score: 1,
          value: draft.validation.valid_response.value
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.score = val;
        } else {
          draft.validation.alt_responses[correctTab - 1].score = val;
        }

        updateVariables(draft);
      })
    );
  };

  const handleAnswerChange = ans => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.value = ans;
        } else {
          draft.validation.alt_responses[correctTab - 1].value = ans;
        }

        updateVariables(draft);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses.splice(tabIndex, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.valid_response.value : item.validation.alt_responses[correctTab - 1].value
      }
      view={EDIT}
    />
  );

  return (
    <ContentArea>
      <ComposeQuestion
        item={item}
        setQuestionData={setQuestionData}
        setTemplate={setTemplate}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Template
        item={item}
        template={template}
        setTemplate={setTemplate}
        templateTab={templateTab}
        setQuestionData={setQuestionData}
        setTemplateTab={setTemplateTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <CorrectAnswers
        onTabChange={setCorrectTab}
        correctTab={correctTab}
        onAdd={handleAddAnswer}
        validation={item.validation}
        options={renderOptions()}
        onCloseTab={handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
    </ContentArea>
  );
};

TokenHighlightEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

TokenHighlightEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(TokenHighlightEdit);
