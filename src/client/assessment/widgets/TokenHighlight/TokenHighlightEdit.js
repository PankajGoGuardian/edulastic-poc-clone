import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, find } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";

import { WORD_MODE, PARAGRAPH_MODE, EDIT, CUSTOM_MODE } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import withPoints from "../../components/HOC/withPoints";
import CorrectAnswers from "../../components/CorrectAnswers";
import { ContentArea } from "../../styled/ContentArea";

import TokenHighlightPreview from "./TokenHighlightPreview";
import Options from "./components/Options";
import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";

import { getInitialArray, getParagraphsArray, getSentencesArray, getWordsArray, getCustomArray } from "./helpers";

const OptionsList = withPoints(TokenHighlightPreview);

const TokenHighlightEdit = ({ item, setQuestionData, fillSections, cleanSections, advancedLink, advancedAreOpen }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const [templateTab, setTemplateTab] = useState(0);

  const mode = item.tokenization;

  const initialArray = getInitialArray(item.template);

  const [template, setTemplate] = useState();

  useEffect(() => {
    setQuestionData(
      produce(item, draft => {
        if (template || draft.templeWithTokens.length === 0) {
          let resultArray = [];
          if (mode === WORD_MODE) {
            resultArray = getWordsArray(initialArray);
          } else if (mode === PARAGRAPH_MODE) {
            resultArray = getParagraphsArray(initialArray);
          } else if (mode === CUSTOM_MODE) {
            resultArray = getCustomArray(initialArray);
          } else {
            resultArray = getSentencesArray(initialArray);
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
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }

        draft.validation.altResponses.push({
          score: 1,
          value: []
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = val;
        } else {
          draft.validation.altResponses[correctTab - 1].score = val;
        }

        updateVariables(draft);
      })
    );
  };

  const handleAnswerChange = (ans, click) => {
    setQuestionData(
      produce(item, draft => {
        // keep previous correct answer on changing custom token, not on clicking token.
        if (mode === CUSTOM_MODE && !click) {
          let prevAnswers = draft.validation.validResponse.value;
          if (correctTab !== 0) {
            prevAnswers = draft.validation.altResponses[correctTab - 1].value;
          }
          ans.forEach(elem => {
            const exist = find(prevAnswers, pans => pans.value === elem.value && pans.selected);
            if (exist) {
              elem.selected = true;
            }
          });
        }
        if (correctTab === 0) {
          draft.validation.validResponse.value = ans;
        } else {
          draft.validation.altResponses[correctTab - 1].value = ans;
        }

        updateVariables(draft);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
      }
      mode={mode}
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.validResponse.value : item.validation.altResponses[correctTab - 1].value
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

      {advancedLink}

      <Options
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />
    </ContentArea>
  );
};

TokenHighlightEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  advancedLink: PropTypes.any
};

TokenHighlightEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null
};

export default withNamespaces("assessment")(TokenHighlightEdit);
