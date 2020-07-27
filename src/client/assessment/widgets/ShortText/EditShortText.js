import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import { EXACT_MATCH, CONTAINS } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import CorrectAnswers from "../../components/CorrectAnswers";
import { ContentArea } from "../../styled/ContentArea";

import CorrectAnswer from "./components/CorrectAnswer";
import ComposeQuestion from "./components/ComposeQuestion";
import Options from "./components/Options";
import Question from "../../components/Question";

const EditShortText = ({ item, setQuestionData, fillSections, cleanSections, advancedLink, advancedAreOpen, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          score: 1,
          matchingRule: EXACT_MATCH,
          value: ""
        });
      })
    );
    setCorrectTab(correctTab + 1);
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

  const handleScoringTypeChange = value => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.matchingRule = value;
        } else {
          draft.validation.altResponses[correctTab - 1].matchingRule = value;
        }

        updateVariables(draft);
      })
    );
  };

  const handleValueChange = value => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = value;
        } else {
          draft.validation.altResponses[correctTab - 1].value = value;
        }

        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <CorrectAnswer
      title={item.title}
      item={item}
      onSelectChange={handleScoringTypeChange}
      onChange={handleValueChange}
      options={[
        { value: EXACT_MATCH, label: t("component.shortText.exactMatch") },
        { value: CONTAINS, label: t("component.shortText.anyTextContaining") }
      ]}
      selectValue={
        correctTab === 0
          ? item.validation.validResponse.matchingRule
          : item.validation.altResponses[correctTab - 1].matchingRule
      }
      inputValue={
        correctTab === 0 ? item.validation.validResponse.value : item.validation.altResponses[correctTab - 1].value
      }
      isCorrectAnsTab={correctTab === 0}
    />
  );

  return (
    <ContentArea>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <Question
        section="main"
        label={t("component.shortText.correctAnswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          questionType={item?.title}
          onChangePoints={handlePointsChange}
          points={
            correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
          }
          isCorrectAnsTab={correctTab === 0}
        />
      </Question>

      {advancedLink}

      <Options
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
        showScoringSection // To show scoring section regardless advanced section is open or close
        item={item}
        extraInScoring={renderOptions()}
        showScoringType={false} // To hide scoring method section inside scoring section
        isCorrectAnsTab={correctTab === 0}
      />
    </ContentArea>
  );
};

EditShortText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  advancedLink: PropTypes.any
};

EditShortText.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null
};

export default withNamespaces("assessment")(EditShortText);
