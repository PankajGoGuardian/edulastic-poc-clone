import React, { useState } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { ContentArea } from "../../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import Options from "./Options";

const HighlightImageEdit = ({ item, fillSections, cleanSections, advancedLink, advancedAreOpen }) => {
  const [loading, setLoading] = useState(false);

  return (
    <ContentArea>
      <ComposeQuestion
        loading={loading}
        setLoading={setLoading}
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
      {advancedLink}
      <Options
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
        item={item}
      />
    </ContentArea>
  );
};

HighlightImageEdit.propTypes = {
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  advancedLink: PropTypes.any
};

HighlightImageEdit.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
  advancedLink: null
};

export default withNamespaces("assessment")(HighlightImageEdit);
