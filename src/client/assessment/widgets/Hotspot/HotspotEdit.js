import "rc-color-picker/assets/index.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import CorrectAnswers from "../../components/CorrectAnswers";
import withPoints from "../../components/HOC/withPoints";
import { ContentArea } from "../../styled/ContentArea";

import { EDIT } from "../../constants/constantsForQuestions";

import HotspotPreview from "./HotspotPreview";
import { StyledCheckbox } from "./styled/StyledCheckbox";

import ComposeQuestion from "./ComposeQuestion";
import AreasBlockTitle from "./AreasBlockTitle";
import AttributesTitle from "./AttributesTitle";
import Options from "./components/Options";
import Question from "../../components/Question";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";

const OptionsList = withPoints(HotspotPreview);

const HotspotEdit = ({
  item,
  setQuestionData,
  t,
  theme,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections
}) => {
  const { areaAttributes, multipleResponses } = item;

  const [loading, setLoading] = useState(false);

  const getAreaIndexes = arr => {
    const newIndexes = [];

    if (arr.length > 0) {
      arr.forEach(attr => {
        newIndexes.push(attr.area);
      });
    }

    return newIndexes;
  };

  const [customizeTab, setCustomizeTab] = useState(0);
  const [correctTab, setCorrectTab] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState(getAreaIndexes(areaAttributes.local));

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const handleResponseMode = () => {
    setQuestionData(
      produce(item, draft => {
        if (multipleResponses) {
          draft.validation.validResponse.value.splice(1);
          draft.validation.altResponses.forEach(alt => {
            alt.value.splice(1);
          });
        }

        draft.multipleResponses = !multipleResponses;
        updateVariables(draft);
      })
    );
  };

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
        updateVariables(draft);
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

  const handleAnswerChange = ans => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = ans;
        } else {
          draft.validation.altResponses[correctTab - 1].value = ans;
        }
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
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      userAnswer={
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
        loading={loading}
        setLoading={setLoading}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <AreasBlockTitle item={item} fillSections={fillSections} cleanSections={cleanSections} />

      <AttributesTitle
        item={item}
        theme={theme}
        customizeTab={customizeTab}
        setCustomizeTab={setCustomizeTab}
        setQuestionData={setQuestionData}
        selectedIndexes={selectedIndexes}
        setSelectedIndexes={setSelectedIndexes}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Question
        section="main"
        label={t("component.hotspot.correctAnswer")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          questionType={item?.title}
        />
        <CheckboxLabel mt="15px" onChange={handleResponseMode} defaultChecked={multipleResponses}>
          {t("component.hotspot.multipleResponses")}
        </CheckboxLabel>
      </Question>

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

HotspotEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any
};

HotspotEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(HotspotEdit);
