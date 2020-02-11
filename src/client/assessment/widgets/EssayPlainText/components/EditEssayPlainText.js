import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { Checkbox } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../../utils/variables";

import WordLimitAndCount from "../../../components/WordLimitAndCount";
import Scoring from "../../../containers/WidgetOptions/components/Scoring";
import { ContentArea } from "../../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import FormattingOptions from "./FormattingOptions";
import Options from "./Options";
import Question from "../../../components/Question";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";

const EditEssayPlainText = ({
  item,
  setQuestionData,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
  t
}) => {
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

      <FormattingOptions item={item} fillSections={fillSections} cleanSections={cleanSections} />

      <Question
        section="main"
        label={t("component.essayText.scoring")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Scoring isSection={false} t={t} scoringTypes={[]} questionData={item} advancedAreOpen={advancedAreOpen}>
          <WordLimitAndCount
            onChange={handleItemChangeChange}
            selectValue={item.showWordLimit}
            inputValue={item.maxWord}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
            showHeading={false}
          />

          <CheckboxLabel
            defaultChecked={item.showWordCount}
            onChange={e => handleItemChangeChange("showWordCount", e.target.checked)}
          >
            {t("component.essayText.showWordCheckbox")}
          </CheckboxLabel>
        </Scoring>
      </Question>

      {advancedLink}

      <Options
        item={item}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
    </ContentArea>
  );
};

EditEssayPlainText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool
};

EditEssayPlainText.defaultProps = {
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(EditEssayPlainText);
