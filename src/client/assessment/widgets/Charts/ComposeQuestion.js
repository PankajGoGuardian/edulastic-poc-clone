import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import { FRACTION_FORMATS } from "../../constants/constantsForQuestions";

class ComposeQuestion extends Component {
  getFractionFormatSettings = () => {
    const { t } = this.props;
    return [
      { label: t("component.options.fractionFormatOptions.decimal"), value: FRACTION_FORMATS.decimal },
      { label: t("component.options.fractionFormatOptions.fraction"), value: FRACTION_FORMATS.fraction },
      { label: t("component.options.fractionFormatOptions.mixedFraction"), value: FRACTION_FORMATS.mixedFraction }
    ];
  };

  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.chart.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.chart.composeQuestion")}`)}>
          {t("component.chart.composeQuestion")}
        </Subtitle>

        <QuestionTextArea
          placeholder={t("component.chart.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />
      </Question>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ComposeQuestion);
