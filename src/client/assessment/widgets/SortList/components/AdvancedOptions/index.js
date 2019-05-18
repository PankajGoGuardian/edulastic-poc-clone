import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../../containers/WidgetOptions";

import Extras from "../../../../containers/Extras";
import LayoutWrapper from "./Layout";

const AdvancedOptions = ({ t, onUiChange, item, fillSections, cleanSections, advancedAreOpen }) => (
  <WidgetOptions
    outerStyle={{ marginTop: 40 }}
    title={t("common.options.title")}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <LayoutWrapper
      item={item}
      onUiChange={onUiChange}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />
    <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

AdvancedOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

AdvancedOptions.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(AdvancedOptions);
