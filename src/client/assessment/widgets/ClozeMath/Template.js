import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withNamespaces } from "react-i18next";

import { MathInput } from "@edulastic/common";

import { withTutorial } from "../../../tutorials/withTutorial";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { updateVariables } from "../../utils/variables";
import { latexKeys } from "../MathFormula/constants";

class Template extends Component {
  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    const node = ReactDOM.findDOMNode(this);

    if (item.templateDisplay) fillSections("main", t("component.math.template"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { t, item, setQuestionData } = this.props;

    const handleUpdateTemplate = val => {
      setQuestionData(
        produce(item, draft => {
          draft.template = val;
          updateVariables(draft, latexKeys);
        })
      );
    };

    return (
      <Widget>
        <Subtitle data-cy="template">{t("component.math.template")}</Subtitle>
        <MathInput
          showResponse
          symbols={item.symbols}
          numberPad={item.numberPad}
          value={item.template}
          onInput={latex => {
            handleUpdateTemplate(latex);
          }}
          data-cy="templateBox"
        />
      </Widget>
    );
  }
}

Template.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
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

export default enhance(Template);
