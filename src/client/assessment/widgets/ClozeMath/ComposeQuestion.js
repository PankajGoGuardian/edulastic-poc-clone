import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { withNamespaces } from "react-i18next";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.math.composequestion"), node.offsetTop, node.scrollHeight);
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

export default withNamespaces("assessment")(ComposeQuestion);
