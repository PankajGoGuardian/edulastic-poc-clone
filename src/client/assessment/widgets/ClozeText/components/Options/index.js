import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../../containers/WidgetOptions";
import Extras from "../../../../containers/Extras";
import Layout from "../../Layout";

const Options = ({ onChange, uiStyle, multipleLine, outerStyle, advancedAreOpen, cleanSections, fillSections }) => (
  <WidgetOptions
    outerStyle={outerStyle}
    advancedAreOpen={advancedAreOpen}
    cleanSections={cleanSections}
    fillSections={fillSections}
  >
    <Layout
      onChange={onChange}
      uiStyle={uiStyle}
      multipleLine={multipleLine}
      advancedAreOpen={advancedAreOpen}
      cleanSections={cleanSections}
      fillSections={fillSections}
    />
    <Extras advancedAreOpen={advancedAreOpen} cleanSections={cleanSections} fillSections={fillSections}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  outerStyle: PropTypes.object,
  multipleLine: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
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
  multipleLine: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Options));
