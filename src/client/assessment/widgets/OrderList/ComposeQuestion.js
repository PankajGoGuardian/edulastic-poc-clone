import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import Question from "../../components/Question";
import { updateVariables } from "../../utils/variables";

class ComposeQuestion extends Component {
  render() {
    const { item, t, setQuestionData, fillSections, cleanSections } = this.props;

    const handleQuestionChange = value => {
      const newData = cloneDeep(item);
      newData.stimulus = value;
      updateVariables(newData);
      setQuestionData(newData);
    };

    if (!item) return null;

    return (
      <Question
        section="main"
        label={t("component.orderlist.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.orderlist.composeQuestion")}</Subtitle>

        <QuestionTextArea onChange={handleQuestionChange} value={item.stimulus} border="border" />
      </Question>
    );
  }
}

ComposeQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
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
      setQuestionData: setQuestionDataAction
    }
  )
)(ComposeQuestion);
