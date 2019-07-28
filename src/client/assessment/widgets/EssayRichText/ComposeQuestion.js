import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";

import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

class ComposeQuestion extends Component {
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
        label={t("component.essayText.composequestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.essayText.composequestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.essayText.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          toolbarId="compose-question"
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

ComposeQuestion.modules = {
  toolbar: {
    container: "#toolbar"
  }
};

export default withNamespaces("assessment")(ComposeQuestion);
