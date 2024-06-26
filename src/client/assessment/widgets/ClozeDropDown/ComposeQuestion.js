import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";

import QuestionTextArea from "../../components/QuestionTextArea";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

class ComposeQuestion extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  componentDidMount = () => {
    const { fillSections, t, item } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const deskHeight = item.uiStyle.layoutHeight;

    fillSections(
      "main",
      t("component.cloze.dropDown.composequestion"),
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight === true,
      deskHeight
    );
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      <Widget>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.cloze.dropDown.composequestion")}`)}>
          {t("component.cloze.dropDown.composequestion")}
        </Subtitle>

        <QuestionTextArea
          toolbarId="stimulus-input"
          placeholder={t("component.cloze.text.thisisstem")}
          onChange={this.onChangeQuestion}
          value={item.stimulus}
          border="border"
        />
      </Widget>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ComposeQuestion);
