import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import { EDIT, BY_COUNT_METHOD } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import CorrectAnswers from "../../components/CorrectAnswers";
import { ContentArea } from "../../styled/ContentArea";

import ShadingPreview from "./ShadingPreview";

import ComposeQuestion from "./ComposeQuestion";
import CanvasSubtitle from "./CanvasSubtitle";
import ShadesSubtitle from "./ShadesSubtitle";
import Options from "./components/Options";
import Question from "../../components/Question";

const ShadingEdit = ({
  item,
  setQuestionData,
  theme,
  saveAnswer,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
  t
}) => {
  const [correctTab, setCorrectTab] = useState(0);

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          ...draft.validation.validResponse,
          score: 1,
          value: []
        });
      })
    );
    setCorrectTab(item.validation.altResponses.length + 1);
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

  const handleAnswerChange = (ans, method) => {
    setQuestionData(
      produce(item, draft => {
        if (method) {
          if (correctTab === 0) {
            const val = ans === BY_COUNT_METHOD ? [1] : [];
            draft.validation.validResponse.method = ans;
            draft.validation.validResponse.value = val;
          } else {
            const val = ans === BY_COUNT_METHOD ? [1] : [];
            draft.validation.altResponses[correctTab - 1].method = ans;
            draft.validation.altResponses[correctTab - 1].value = val;
          }
        } else if (correctTab === 0) {
          draft.validation.validResponse.value = [...ans];
        } else {
          draft.validation.altResponses[correctTab - 1].value = [...ans];
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

  const { validation } = item;
  const response = correctTab === 0 ? validation.validResponse : item.validation.altResponses[correctTab - 1];

  const renderOptions = (
    <ShadingPreview
      item={item}
      saveAnswer={handleAnswerChange}
      method={response.method}
      userAnswer={response.value}
      view={EDIT}
    />
  );

  return (
    <ContentArea>
      <ComposeQuestion
        setQuestionData={setQuestionData}
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <CanvasSubtitle
        item={item}
        theme={theme}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <ShadesSubtitle
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <Question
        section="main"
        label={t("component.shading.correctAnswer")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          questionType={item?.title}
          points={response.score}
          onChangePoints={handlePointsChange}
          isCorrectAnsTab={correctTab === 0}
        />
      </Question>

      {advancedLink}

      <Options
        saveAnswer={saveAnswer}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />
    </ContentArea>
  );
};

ShadingEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any
};

ShadingEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ShadingEdit);
