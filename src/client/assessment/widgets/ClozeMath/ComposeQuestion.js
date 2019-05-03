import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withNamespaces } from "react-i18next";

import { withTutorial } from "../../../tutorials/withTutorial";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import QuestionTextArea from "../../components/QuestionTextArea";
import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.math.composequestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { t, item, setQuestionData } = this.props;

    const _itemChange = (prop, uiStyle) => {
      const newItem = produce(item, draft => {
        draft[prop] = uiStyle;
      });

      setQuestionData(newItem);
    };

    return (
      <Widget>
        <Subtitle>{t("component.math.composequestion")}</Subtitle>
        <QuestionTextArea
          inputId="stimulusInput"
          placeholder="Enter question"
          onChange={stimulus => _itemChange("stimulus", stimulus)}
          value={item.stimulus}
        />
      </Widget>
    );
  }
}

ComposeQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ComposeQuestion.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withTutorial("clozeMath"),
  withNamespaces("assessment"),
  connect(
    (state, { item }) => ({
      evaluation: state.evaluation[item.id]
    }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

export default enhance(ComposeQuestion);
