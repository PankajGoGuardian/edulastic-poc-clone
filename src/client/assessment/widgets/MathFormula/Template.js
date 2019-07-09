import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import ReactDOM from "react-dom";
import { cloneDeep } from "lodash";

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

    if (item.templateDisplay) fillSections("main", t("component.math.template"), node.offsetTop, node.scrollHeight);
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

    const handleChangeKeypad = keypad => {
      setQuestionData(
        produce(item, draft => {
          const symbols = cloneDeep(draft.symbols);
          symbols[0] = keypad;
          draft.symbols = symbols;
          updateVariables(draft, latexKeys);
        })
      );
    };

    return (
      <Widget visible={item.templateDisplay}>
        <Subtitle data-cy="template-container">{t("component.math.template")}</Subtitle>
        <MathInput
          showResponse
          showDropdown
          symbols={item.symbols}
          numberPad={item.numberPad}
          value={item.template}
          onChangeKeypad={handleChangeKeypad}
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
