import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

import { latexKeys } from "./constants";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class ComposeQuestion extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleItemChangeChange = (prop, stimulus) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = stimulus;
          updateVariables(draft, latexKeys);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.math.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.math.composeQuestion")}`)}>
          {t("component.math.composeQuestion")}
        </Subtitle>

        <QuestionTextArea
          placeholder={t("component.math.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />
      </Question>
    );
  }
}

ComposeQuestion.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ComposeQuestion.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
)(ComposeQuestion);
