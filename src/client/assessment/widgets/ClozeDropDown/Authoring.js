/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { isUndefined } from "lodash";
import "react-quill/dist/quill.snow.css";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import ComposeQuestion from "./ComposeQuestion";
import TemplateMarkup from "./TemplateMarkup";
import ChoicesForResponse from "./ChoicesForResponse";

class ClozeDropDownAuthoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  getResponseCount = tmpl => {
    if (isUndefined(window.$)) {
      return;
    }
    return $($.parseHTML(tmpl || "")).find("textdropdown").length;
  };

  render() {
    const { item, fillSections, cleanSections } = this.props;
    const responseContainersCount = this.getResponseCount(item.templateMarkUp);
    const responseContainers = new Array(responseContainersCount).fill(true);

    return (
      <div>
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />
        <TemplateMarkup item={item} fillSections={fillSections} cleanSections={cleanSections} />
        {responseContainers.map((resp, index) => (
          <ChoicesForResponse
            item={item}
            index={index}
            key={index}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        ))}
      </div>
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

export default enhance(ClozeDropDownAuthoring);
