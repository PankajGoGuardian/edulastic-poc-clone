import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { connect } from "react-redux";
import { updateVariables } from "../../utils/variables";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";

import { Widget } from "../../styled/Widget";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.matchList.composeQuestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

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
        <Subtitle>{t("component.matchList.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.matchList.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
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

export default withNamespaces("assessment")(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )(ComposeQuestion)
);
