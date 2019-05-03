import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import ReactDOM from "react-dom";

import { MathInput } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import { latexKeys } from "./constants";

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
    const { item, setQuestionData, t } = this.props;

    const handleUpdateTemplate = val => {
      setQuestionData(
        produce(item, draft => {
          draft.template = val;
          updateVariables(draft, latexKeys);
        })
      );
    };

    return (
      <Widget style={{ display: item.templateDisplay ? "inherit" : "none" }}>
        <Subtitle data-cy="template-container">{t("component.math.template")}</Subtitle>
        <MathInput
          showResponse
          symbols={item.symbols}
          numberPad={item.numberPad}
          value={item.template}
          onInput={latex => {
            handleUpdateTemplate(latex);
          }}
        />
      </Widget>
    );
  }
}

Template.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
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
)(Template);
