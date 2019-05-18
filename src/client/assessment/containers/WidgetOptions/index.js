import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { evaluationType } from "@edulastic/constants";

import Scoring from "./components/Scoring";
import Variables from "./components/Variables";

const types = [evaluationType.exactMatch, evaluationType.partialMatch];

class WidgetOptions extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    scoringTypes: PropTypes.array,
    showScoring: PropTypes.bool,
    showVariables: PropTypes.bool,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool
  };

  static defaultProps = {
    scoringTypes: types,
    showScoring: true,
    showVariables: true,
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

  render() {
    const {
      children,
      scoringTypes,
      showScoring,
      showVariables,
      fillSections,
      cleanSections,
      advancedAreOpen
    } = this.props;

    return (
      <Fragment>
        {showScoring && (
          <Scoring
            scoringTypes={scoringTypes}
            fillSections={fillSections}
            cleanSections={cleanSections}
            advancedAreOpen={advancedAreOpen}
          />
        )}
        {showVariables && (
          <Variables fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen} />
        )}
        {children}
      </Fragment>
    );
  }
}

export default WidgetOptions;
