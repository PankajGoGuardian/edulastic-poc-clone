import React, { useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import { EXACT_MATCH, CONTAINS } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import withPoints from "../../components/HOC/withPoints";
import CorrectAnswers from "../../components/CorrectAnswers";
import { Widget } from "../../styled/Widget";
import { ContentArea } from "../../styled/ContentArea";

import CorrectAnswer from "./components/CorrectAnswer";
import ComposeQuestion from "./components/ComposeQuestion";
import Options from "./components/Options";

const OptionsList = withPoints(CorrectAnswer);

const EditShortText = ({ item, setQuestionData, fillSections, cleanSections, advancedAreOpen, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.alt_responses) {
          draft.validation.alt_responses = [];
        }
        draft.validation.alt_responses.push({
          score: 1,
          matching_rule: EXACT_MATCH,
          value: ""
        });
      })
    );
    setCorrectTab(correctTab + 1);
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

  const handleScoringTypeChange = value => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.matching_rule = value;
        } else {
          draft.validation.alt_responses[correctTab - 1].matching_rule = value;
        }

        updateVariables(draft);
      })
    );
  };

  const handleValueChange = value => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.value = value;
        } else {
          draft.validation.alt_responses[correctTab - 1].value = value;
        }

        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onSelectChange={handleScoringTypeChange}
      onChange={handleValueChange}
      options={[
        { value: EXACT_MATCH, label: t("component.shortText.exactMatch") },
        { value: CONTAINS, label: t("component.shortText.anyTextContaining") }
      ]}
      selectValue={
        correctTab === 0
          ? item.validation.valid_response.matching_rule
          : item.validation.alt_responses[correctTab - 1].matching_rule
      }
      inputValue={
        correctTab === 0 ? item.validation.valid_response.value : item.validation.alt_responses[correctTab - 1].value
      }
      onChangePoints={handlePointsChange}
    />
  );

  return (
    <ContentArea>
      <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />

      <Widget>
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
      </Widget>

      <Options fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen} />
    </ContentArea>
  );
};

EditShortText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

EditShortText.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(EditShortText);
