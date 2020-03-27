import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../../utils/variables";

import { ContentArea } from "../../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import FormattingOptions from "./FormattingOptions";
import Options from "./Options";

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

      <FormattingOptions
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      {advancedLink}

      <Options
        item={item}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        handleItemChangeChange={handleItemChangeChange}
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
