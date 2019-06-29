import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";

import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

// import ComposeQuestion from "./ComposeQuestion";
import TemplateMarkup from "./TemplateMarkup";

class Authoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
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

  render() {
    const { item, fillSections, cleanSections } = this.props;

    return (
      <Fragment>
        {/* <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} /> */}
        <TemplateMarkup item={item} fillSections={fillSections} cleanSections={cleanSections} />
      </Fragment>
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

export default enhance(Authoring);
