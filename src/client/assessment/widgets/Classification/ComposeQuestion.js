import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { connect } from "react-redux";
import { withTheme } from "styled-components";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Widget } from "../../styled/Widget";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.classification.composeQuestion"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  render() {
    const { item, setQuestionData, t } = this.props;

    const { stimulus } = item;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.classification.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.classification.enterQuestion")}
          onChange={stim => handleItemChangeChange("stimulus", stim)}
          value={stimulus}
        />
      </Widget>
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

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ComposeQuestion);
