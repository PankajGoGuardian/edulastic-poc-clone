import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../containers/Extras";
import WidgetOptions from "../../../containers/WidgetOptions";
import Layout from "./Layout";

const FormulaEssayOptions = ({ onChange, item, fillSections, cleanSections, advancedAreOpen }) => (
  <WidgetOptions
    showScoring={true}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <Layout
      onChange={onChange}
      item={item}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />

    <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
  </WidgetOptions>
);

FormulaEssayOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormulaEssayOptions.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(FormulaEssayOptions);
