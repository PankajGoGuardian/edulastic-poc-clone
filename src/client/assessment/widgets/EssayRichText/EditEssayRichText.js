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

const EditEssayRichText = ({ item, setQuestionData, t, fillSections, cleanSections, advancedAreOpen }) => {
  const [act, setAct] = useState(item.formatting_options || []);

  useEffect(() => {
    if (!isEqual(act, item.formatting_options)) {
      setAct(item.formatting_options);
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
        label={t("component.options.scoring")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Scoring
          setQuestionData={setQuestionData}
          t={t}
          scoringTypes={[]}
          questionData={item}
          advancedAreOpen={advancedAreOpen}
          noPaddingLeft
        />
        <WordLimitAndCount
          withOutTopMargin
          onChange={handleItemChangeChange}
          selectValue={item.show_word_limit}
          inputValue={item.max_word}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
          showHeading={false}
        />
        <Checkbox
          style={{ marginTop: 32 }}
          defaultChecked={item.show_word_count}
          onChange={e => handleItemChangeChange("show_word_count", e.target.checked)}
        >
          {t("component.essayText.showWordCheckbox")}
        </Checkbox>
      </Question>

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
  advancedAreOpen: PropTypes.bool
};

EditEssayRichText.defaultProps = {
  advancedAreOpen: false,
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
