import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.math.composeQuestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

    const handleItemChange = (prop, data) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = data;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.math.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.math.enterQuestion")}
          onChange={stimulus => handleItemChange("stimulus", stimulus)}
          value={item.stimulus}
        />
      </Widget>
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
