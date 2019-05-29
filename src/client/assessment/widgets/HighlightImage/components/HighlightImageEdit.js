import React, { useState } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { ContentArea } from "../../../styled/ContentArea";

import ComposeQuestion from "./ComposeQuestion";
import LineColorOptionsSubtitle from "./LineColorOptionsSubtitle";
import Options from "./Options";

const HighlightImageEdit = ({ item, fillSections, cleanSections, advancedAreOpen, setQuestionData }) => {
  const { line_color } = item;

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

      <LineColorOptionsSubtitle
        line_color={line_color}
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Options fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen} />
    </ContentArea>
  );
};

HighlightImageEdit.propTypes = {
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

HighlightImageEdit.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

export default withNamespaces("assessment")(HighlightImageEdit);
