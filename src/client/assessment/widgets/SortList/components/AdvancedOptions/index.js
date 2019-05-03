import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../../containers/WidgetOptions";

import Extras from "../../../../containers/Extras";
import LayoutWrapper from "./Layout";

const AdvancedOptions = ({ t, onUiChange, item, fillSections, cleanSections }) => (
  <WidgetOptions
    outerStyle={{ marginTop: 40 }}
    title={t("common.options.title")}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <LayoutWrapper item={item} onUiChange={onUiChange} fillSections={fillSections} cleanSections={cleanSections} />
    <Extras fillSections={fillSections} cleanSections={cleanSections}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

AdvancedOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

AdvancedOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(AdvancedOptions);
