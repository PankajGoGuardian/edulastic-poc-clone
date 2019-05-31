import React, { Component } from "react";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import Scoring from "../../../containers/WidgetOptions/components/Scoring";

const types = [
  { label: "Exact match", value: "exactMatch" },
  { label: "Partial match", value: "partialMatch" },
  { label: "Partial match v2", value: "partialMatchV2" },
  { label: "Contains", value: "contains" },
  { label: "By location", value: "byLocation" },
  { label: "By count", value: "byCount" }
];

class ScoreSettings extends Component {
  render() {
    const { scoringTypes, showSelect, cleanSections, fillSections, advancedAreOpen } = this.props;
    return (
      <Scoring
        showSelect={showSelect}
        scoringTypes={scoringTypes}
        cleanSections={cleanSections}
        fillSections={fillSections}
        advancedAreOpen={advancedAreOpen}
        isSection
      />
    );
  }
}

ScoreSettings.propTypes = {
  scoringTypes: PropTypes.array,
  showSelect: PropTypes.bool,
  cleanSections: PropTypes.func,
  fillSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

ScoreSettings.defaultProps = {
  scoringTypes: types,
  showSelect: true,
  cleanSections: () => {},
  fillSections: () => {},
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(ScoreSettings);
