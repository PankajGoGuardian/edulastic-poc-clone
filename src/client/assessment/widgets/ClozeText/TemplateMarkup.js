import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";

import { CustomQuillComponent } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const defaultTemplateMarkup =
  '<p>"It\'s all clear" he</p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p>Have you the </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> and the bags? <br /> Great Scott!!! Jump, archie, jump, and I\'ll swing for it</p>';

class TemplateMarkup extends Component {
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
    const node = ReactDOM.findDOMNode(this);
    const deskHeight = item.ui_style.layout_height;

    fillSections(
      "main",
      t("component.cloze.text.templatemarkup"),
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight === true,
      deskHeight
    );
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onChangeMarkUp = templateMarkUp => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.templateMarkUp = templateMarkUp;
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      <Widget>
        <Subtitle>{t("component.cloze.text.templatemarkup")}</Subtitle>
        <CustomQuillComponent
          toolbarId="templatemarkup"
          wrappedRef={instance => {
            this.templatemarkup = instance;
          }}
          placeholder={t("component.cloze.text.templatemarkupplaceholder")}
          onChange={this.onChangeMarkUp}
          firstFocus={!item.templateMarkUp}
          showResponseBtn
          value={item.templateMarkUp || defaultTemplateMarkup}
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

export default enhance(TemplateMarkup);
