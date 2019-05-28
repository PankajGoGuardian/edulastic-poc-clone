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

const OptionsList = withPoints(HotspotPreview);

const HotspotEdit = ({ item, setQuestionData, t, theme, advancedAreOpen, fillSections, cleanSections }) => {
  const { area_attributes, multiple_responses } = item;

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
  const [selectedIndexes, setSelectedIndexes] = useState(getAreaIndexes(area_attributes.local));

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses.splice(tabIndex, 1);

        setCorrectTab(0);
        updateVariables(draft);
      })
    );
  };

  const handleResponseMode = () => {
    setQuestionData(
      produce(item, draft => {
        if (multiple_responses) {
          draft.validation.valid_response.value.splice(1);
          draft.validation.alt_responses.forEach(alt => {
            alt.value.splice(1);
          });
        }

        draft.multiple_responses = !multiple_responses;
        updateVariables(draft);
      })
    );
  };

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
        updateVariables(draft);
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

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      userAnswer={
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

      <CorrectAnswers
        onTabChange={setCorrectTab}
        correctTab={correctTab}
        onAdd={handleAddAnswer}
        validation={item.validation}
        options={renderOptions()}
        onCloseTab={handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <StyledCheckbox onChange={handleResponseMode} defaultChecked={multiple_responses} style={{ marginBottom: 30 }}>
          {t("component.hotspot.multipleResponses")}
        </StyledCheckbox>
      </CorrectAnswers>

      <Options advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
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
  cleanSections: PropTypes.func
};

HotspotEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(HotspotEdit);
