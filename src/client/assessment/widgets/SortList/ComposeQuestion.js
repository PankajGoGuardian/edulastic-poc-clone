import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";

import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { Widget, WidgetFRContainer } from "../../styled/Widget";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.sortList.composeQuestion"), node.offsetTop, node.scrollHeight);
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
        <Subtitle>{t("component.sortList.composeQuestion")}</Subtitle>

        <WidgetFRContainer>
          <QuestionTextArea
            placeholder={t("component.sortList.enterQuestion")}
            onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
            value={item.stimulus}
          />
        </WidgetFRContainer>
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

export default withNamespaces("assessment")(ComposeQuestion);
