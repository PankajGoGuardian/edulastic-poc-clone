import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import ComposeQuestion from "./ComposeQuestion";
import PossibleResponses from "./PossibleResponses";

class Authoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  render() {
    const { item, theme, fillSections, cleanSections } = this.props;

    return (
      <React.Fragment>
        <ComposeQuestion item={item} theme={theme} fillSections={fillSections} cleanSections={cleanSections} />
        <PossibleResponses item={item} fillSections={fillSections} cleanSections={cleanSections} />
      </React.Fragment>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    {}
  )
);

export default enhance(Authoring);
