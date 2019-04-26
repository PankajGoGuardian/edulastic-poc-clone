import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType } from "@edulastic/constants";

import WidgetOptions from "../../../../containers/WidgetOptions";
import Extras from "../../../../containers/Extras";
import Layout from "./Layout";

const scoringTypes = [evaluationType.exactMatch, evaluationType.partialMatch, evaluationType.partialMatchV2];

const Options = ({ onChange, uiStyle, outerStyle, fillSections, cleanSections }) => (
  <WidgetOptions
    outerStyle={outerStyle}
    scoringTypes={scoringTypes}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <Layout onChange={onChange} uiStyle={uiStyle} fillSections={fillSections} cleanSections={cleanSections} />
    <Extras fillSections={fillSections} cleanSections={cleanSections}>
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
  cleanSections: PropTypes.func
};

Options.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: "",
    responsecontainerindividuals: []
  },
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Options));
