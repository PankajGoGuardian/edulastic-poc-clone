import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { evaluationType } from "@edulastic/constants";
import { CheckboxLabel } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import Scoring from "./components/Scoring";
import Variables from "./components/Variables";
import Question from "../../components/Question";
import WordLimitAndCount from "../../components/WordLimitAndCount";

const types = [evaluationType.exactMatch, evaluationType.partialMatch];

class WidgetOptions extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    scoringTypes: PropTypes.array,
    showScoring: PropTypes.bool,
    showVariables: PropTypes.bool,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool,
    showSelect: PropTypes.bool,
    renderExtra: PropTypes.any
  };

  static defaultProps = {
    scoringTypes: types,
    showScoring: true,
    showVariables: true,
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {},
    showSelect: true,
    renderExtra: null
  };

  render() {
    const {
      children,
      scoringTypes,
      showScoring,
      showVariables,
      fillSections,
      cleanSections,
      advancedAreOpen,
      showSelect,
      renderExtra,
      item,
      handleItemChangeChange,
      t
    } = this.props;

    return (
      <Fragment>
        {renderExtra}
        {showScoring && (
          <Question
            section="advanced"
            label="Scoring"
            fillSections={fillSections}
            cleanSections={cleanSections}
            advancedAreOpen={advancedAreOpen}
          >
            <Scoring
              scoringTypes={[]}
              isSection={false}
              fillSections={fillSections}
              cleanSections={cleanSections}
              advancedAreOpen={advancedAreOpen}
              showSelect={showSelect}
              item={item}
            />

            <WordLimitAndCount
              onChange={handleItemChangeChange}
              selectValue={item.showWordLimit}
              inputValue={item.maxWord}
              advancedAreOpen={advancedAreOpen}
              fillSections={fillSections}
              cleanSections={cleanSections}
              title={item?.title}
              showHeading={false}
            />

            <CheckboxLabel
              defaultChecked={item.showWordCount}
              onChange={e => handleItemChangeChange("showWordCount", e.target.checked)}
            >
              {t("component.essayText.showWordCheckbox")}
            </CheckboxLabel>
          </Question>
        )}
        {showVariables && (
          <Variables
            fillSections={fillSections}
            cleanSections={cleanSections}
            advancedAreOpen={advancedAreOpen}
            item={item}
          />
        )}
        {children}
      </Fragment>
    );
  }
}

export default withNamespaces("assessment")(WidgetOptions);
