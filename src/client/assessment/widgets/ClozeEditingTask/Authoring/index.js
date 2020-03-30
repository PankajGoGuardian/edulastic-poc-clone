import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import TemplateMarkup from "./TemplateMarkup";
import CorrectAnswers from "./CorrectAnswers";
import Options from "./Options";
import ChoicesForResponses from "./ChoicesForResponses";
import { updateVariables } from "../../../utils/variables";

const Authoring = ({
  item,
  previewData,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
  setQuestionData
}) => {
  const handleOptionsChange = (name, value) => {
    setQuestionData(
      produce(item, draft => {
        draft[name] = value;
        updateVariables(draft);
      })
    );
  };

  const { responseIds, validation, uiStyle } = item;
  const { previewDisplayOptions, itemForPreview, previewStimulus } = previewData;
  const commonProps = {
    item,
    fillSections,
    cleanSections,
    setQuestionData
  };

  return (
    <React.Fragment>
      <TemplateMarkup {...commonProps} />

      <CorrectAnswers
        {...commonProps}
        key="editingTypeCorrectAnswers"
        uiStyle={uiStyle}
        validation={validation}
        options={previewDisplayOptions}
        item={itemForPreview}
        stimulus={previewStimulus}
      />

      <ChoicesForResponses {...commonProps} />

      {advancedLink}

      <Options
        {...commonProps}
        uiStyle={uiStyle}
        outerStyle={{ padding: "30px 120px" }}
        responseIDs={responseIds}
        advancedAreOpen={advancedAreOpen}
        onChange={handleOptionsChange}
      />
    </React.Fragment>
  );
};

Authoring.propTypes = {
  previewData: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

export default Authoring;
