import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../containers/Extras";
import WidgetOptions from "../../../containers/WidgetOptions";

import LayoutComponent from "./LayoutComponent";

class Options extends Component {
  render() {
    const { item, advancedAreOpen, fillSections, cleanSections, t } = this.props;

    return (
      <WidgetOptions
        showScoring={false}
        outerStyle={{ marginTop: 40 }}
        title={t("common.options.title")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <LayoutComponent
          item={item}
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
  }
}

Options.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Options.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Options);
