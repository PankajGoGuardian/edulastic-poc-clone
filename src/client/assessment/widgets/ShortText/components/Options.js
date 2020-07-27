import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import WidgetOptions from "../../../containers/WidgetOptions";

import Extras from "../../../containers/Extras";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

import LayoutComponent from "./LayoutComponent";

const Options = ({
  item,
  fillSections,
  cleanSections,
  advancedAreOpen,
  showScoringSection,
  extraInScoring,
  showScoringType,
  isCorrectAnsTab
}) => (
  <WidgetOptions
    fillSections={fillSections}
    cleanSections={cleanSections}
    advancedAreOpen={advancedAreOpen}
    item={item}
    showScoringSection={showScoringSection}
    extraInScoring={extraInScoring}
    showScoringType={showScoringType}
    isCorrectAnsTab={isCorrectAnsTab}
  >
    <LayoutComponent
      item={item}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    />
    <Extras fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  showScoringSection: PropTypes.bool,
  extraInScoring: PropTypes.elementType,
  showScoringType: PropTypes.bool
};

Options.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
  showScoringSection: false,
  extraInScoring: null,
  showScoringType: true
};

const enhance = compose(
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Options);
