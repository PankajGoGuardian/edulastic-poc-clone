import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType } from "@edulastic/constants";

import WidgetOptions from "../../../../containers/WidgetOptions";
import Extras from "../../../../containers/Extras";
import Layout from "./Layout";

const scoringTypes = [evaluationType.exactMatch, evaluationType.partialMatch];

const Options = ({
  onChange,
  uiStyle,
  outerStyle,
  fillSections,
  cleanSections,
  advancedAreOpen,
  responseIDs,
  item = {}
}) => (
  <WidgetOptions
    showVariables
    outerStyle={outerStyle}
    scoringTypes={scoringTypes}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
    item={item}
  >
    <Layout
      onChange={onChange}
      uiStyle={uiStyle}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
      responseIDs={responseIDs}
      item={item}
    />
    <Extras fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  outerStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  responseIDs: PropTypes.array
};

Options.defaultProps = {
  outerStyle: {},
  responseIDs: [],
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: "",
    responsecontainerindividuals: []
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Options));
