import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import produce from "immer";
import { Checkbox } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import WordLimitAndCount from "../../components/WordLimitAndCount";
import { ContentArea } from "../../styled/ContentArea";
import Question from "../../components/Question";

import ComposeQuestion from "./ComposeQuestion";
import FormattingOptions from "./FormattingOptions";
import Options from "./Options";
import Scoring from "../../containers/WidgetOptions/components/Scoring";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

const EditEssayRichText = ({
  item,
  setQuestionData,
  t,
  fillSections,
  cleanSections,
  advancedLink,
  advancedAreOpen
}) => {
  const [act, setAct] = useState(item.formattingOptions || []);

  useEffect(() => {
    if (!isEqual(act, item.formattingOptions)) {
      setAct(item.formattingOptions);
    }
  });

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
        updateVariables(draft);
      })
    );
  };

  return (
    <ContentArea>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <FormattingOptions
        item={item}
        act={act}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <Question
        section="main"
        label={t("component.essayText.wordsLimitTitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <WordLimitAndCount
          withOutTopMargin
          onChange={handleItemChangeChange}
          selectValue={item.showWordLimit}
          inputValue={item.maxWord}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
          showHeading={false}
        />

        <Checkbox
          style={{ marginTop: 32 }}
          defaultChecked={item.showWordCount}
          onChange={e => handleItemChangeChange("showWordCount", e.target.checked)}
        >
          {t("component.essayText.showWordCheckbox")}
        </Checkbox>
      </Question>

      <Scoring
        setQuestionData={setQuestionData}
        t={t}
        scoringTypes={[]}
        questionData={item}
        advancedAreOpen={advancedAreOpen}
      />

      {advancedLink}

      <Options
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />
    </ContentArea>
  );
};

EditEssayRichText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool
};

EditEssayRichText.defaultProps = {
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(EditEssayRichText);
