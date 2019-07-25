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

const EditEssayPlainText = ({ item, setQuestionData, advancedAreOpen, fillSections, cleanSections, t }) => {
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

      <Scoring
        isSection
        t={t}
        scoringTypes={[]}
        questionData={item}
        advancedAreOpen={advancedAreOpen}
        noPaddingLeft={true}
      >
        <WordLimitAndCount
          onChange={handleItemChangeChange}
          selectValue={item.show_word_limit}
          inputValue={item.max_word}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
          showHeading={false}
        />

        <Checkbox
          style={{ marginTop: 32 }}
          defaultChecked={item.show_word_count}
          onChange={e => handleItemChangeChange("show_word_count", e.target.checked)}
        >
          {t("component.essayText.showWordCheckbox")}
        </Checkbox>
      </Scoring>

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
  advancedAreOpen: PropTypes.bool
};

EditEssayPlainText.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(EditEssayPlainText);
