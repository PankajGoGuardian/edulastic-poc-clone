import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { withTheme } from "styled-components";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { CustomQuillComponent } from "@edulastic/common";

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
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.cloze.dragDrop.composequestion"), node.offsetTop);
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options = arrayMove(draft.options, oldIndex, newIndex);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      <Widget>
        <Subtitle>{t("component.cloze.dragDrop.composequestion")}</Subtitle>
        <CustomQuillComponent
          toolbarId="stimulus"
          wrappedRef={instance => {
            this.stimulus = instance;
          }}
          placeholder={t("component.cloze.dragDrop.thisisstem")}
          onChange={this.onChangeQuestion}
          showResponseBtn={false}
          value={item.stimulus}
        />
      </Widget>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ComposeQuestion);
