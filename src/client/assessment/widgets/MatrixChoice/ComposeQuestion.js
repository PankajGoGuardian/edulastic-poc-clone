import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withRouter } from "react-router-dom";

import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import Question from "../../components/Question";
import { Subtitle } from "../../styled/Subtitle";

import { checkAnswerAction } from "../../../author/src/actions/testItem";

class ComposeQuestion extends Component {
  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  render() {
    const { item, t, fillSections, cleanSections } = this.props;

    return (
      <Question
        dataCy="questiontext"
        section="main"
        label={t("component.multiplechoice.composequestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.multiplechoice.composequestion")}</Subtitle>

        <QuestionTextArea
          placeholder={t("component.matrix.enterQuestion")}
          onChange={this.onChangeQuestion}
          value={item.stimulus ? item.stimulus : ""}
          border="border"
        />
      </Question>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
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
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
)(ComposeQuestion);
