import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import WidgetOptions from "../../../containers/WidgetOptions";

import Extras from "./Extras";
import Settings from "./Settings";

const AdvancedOptions = ({ t, theme, item, fillSections, cleanSections, advancedAreOpen }) => {
  const [modalSettings, setModalSettings] = useState({
    editMode: false,
    modalName: ""
  });

  return (
    <WidgetOptions
      showScoring={false}
      showVariables={false}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Settings
        t={t}
        item={item}
        modalSettings={modalSettings}
        setModalSettings={setModalSettings}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />

      <Extras
        t={t}
        item={item}
        theme={theme}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />
    </WidgetOptions>
  );
};

AdvancedOptions.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

AdvancedOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

const enhance = compose(withTheme);

export default enhance(AdvancedOptions);
