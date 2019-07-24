import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";

import { updateVariables } from "../../../utils/variables";

import { AdaptiveCheckbox } from "../styled/AdaptiveCheckbox";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";

class FormattingOptions extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.essayText.plain.formattingOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.essayText.plain.formattingOptions")}</Subtitle>
        <FlexContainer childMarginRight={100}>
          <AdaptiveCheckbox
            defaultChecked={item.show_copy}
            onChange={e => handleItemChangeChange("show_copy", e.target.checked)}
          >
            {t("component.essayText.copy")}
          </AdaptiveCheckbox>
          <AdaptiveCheckbox
            defaultChecked={item.show_cut}
            onChange={e => handleItemChangeChange("show_cut", e.target.checked)}
          >
            {t("component.essayText.cut")}
          </AdaptiveCheckbox>
          <AdaptiveCheckbox
            defaultChecked={item.show_paste}
            onChange={e => handleItemChangeChange("show_paste", e.target.checked)}
          >
            {t("component.essayText.paste")}
          </AdaptiveCheckbox>
        </FlexContainer>
      </Question>
    );
  }
}

FormattingOptions.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormattingOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(FormattingOptions);
