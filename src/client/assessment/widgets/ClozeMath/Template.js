import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";

import { math } from "@edulastic/constants";
import { CustomQuillComponent } from "@edulastic/common";

import { withTutorial } from "../../../tutorials/withTutorial";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const { methods } = math;

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: "",
  options: {}
};

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

    const _reduceResponseButtons = (responseIndexes = [], value) =>
      responseIndexes.map(nextIndex => {
        const response = value.find((_, i) => nextIndex === i + 1);
        return response || [];
      });

    const _updateTemplate = (val, responseIndexes) => {
      const newItem = produce(item, draft => {
        draft.template = val;

        draft.validation.valid_response.value = _reduceResponseButtons(
          responseIndexes,
          draft.validation.valid_response.value
        );

        if (Array.isArray(draft.validation.alt_responses)) {
          draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
            res.value = _reduceResponseButtons(responseIndexes, res.value);
            return res;
          });
        }
      });

      newItem.validation.valid_response.value.map(res => {
        if (res && !res.length) {
          res.push(initialMethod);
        }
        return res;
      });

      setQuestionData(newItem);
    };

    return (
      <Widget>
        <Subtitle data-cy="template">{t("component.math.template")}</Subtitle>
        <CustomQuillComponent
          inputId="templateInput"
          toolbarId="template"
          onChange={_updateTemplate}
          showResponseBtn
          value={item.template}
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
