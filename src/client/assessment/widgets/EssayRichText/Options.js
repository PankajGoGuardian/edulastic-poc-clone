import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../containers/WidgetOptions";

import Extras from "../../containers/Extras";

import LayoutComponent from "./LayoutComponent";
import FormattingOptions from "./FormattingOptions";

const Options = ({
  item,
  t,
  fillSections,
  cleanSections,
  advancedAreOpen,
  handleItemChangeChange,
  setQuestionData
}) => {
  const [act, setAct] = useState(item.formattingOptions || []);

  useEffect(() => {
    if (!isEqual(act, item.formattingOptions)) {
      setAct(item.formattingOptions);
    }
  });

  return (
    <WidgetOptions
      showScoring
      scoringTypes={[]}
      questionData={item}
      outerStyle={{ marginTop: 40 }}
      title={t("common.options.title")}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
      item={item}
      handleItemChangeChange={handleItemChangeChange}
      showScoringSectionAnyRole
    >
      <LayoutComponent
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />

      <FormattingOptions
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
        advancedAreOpen={advancedAreOpen}
      />
      <Extras fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen}>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

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

export default compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    null
  )
)(Options);
