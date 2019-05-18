import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";

import Layout from "./Layout";

function Options({ onChange, uiStyle, fillSections, cleanSections, advancedAreOpen }) {
  return (
    <WidgetOptions fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen}>
      <Layout
        onChange={onChange}
        uiStyle={uiStyle}
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
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Options.defaultProps = {
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choice_label: "number"
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Options);
