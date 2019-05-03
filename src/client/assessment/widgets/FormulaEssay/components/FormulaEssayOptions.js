import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../containers/Extras";
import WidgetOptions from "../../../containers/WidgetOptions";
import Layout from "./Layout";

const FormulaEssayOptions = ({ onChange, item, fillSections, cleanSections }) => (
  <WidgetOptions showScoring={false} fillSections={fillSections} cleanSections={cleanSections}>
    <Layout onChange={onChange} item={item} fillSections={fillSections} cleanSections={cleanSections} />

    <Extras fillSections={fillSections} cleanSections={cleanSections} />
  </WidgetOptions>
);

FormulaEssayOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormulaEssayOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(FormulaEssayOptions);
