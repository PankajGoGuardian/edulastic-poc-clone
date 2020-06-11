import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";

import { clearAnswersAction } from "../../../actions/answers";
import Breadcrumb from "../../Breadcrumb";
import { Container } from "./styled_components";

class SecondHeadBar extends Component {
  get breadCrumbTarget() {
    const { itemId } = this.props;
    return `/author/items/${itemId || window.location.pathname.split("/")[3]}/item-detail`;
  }

  render() {
    const { breadCrumbQType, children } = this.props;
    let { breadcrumb } = this.props;
    if (breadCrumbQType) {
      breadcrumb = [...breadcrumb, { title: breadCrumbQType, to: this.breadCrumbTarget }];
    }
    return (
      <Container padding="0px">
        <Breadcrumb data={breadcrumb} style={{ position: "unset" }} />
        {children}
      </Container>
    );
  }
}

SecondHeadBar.propTypes = {
  breadcrumb: PropTypes.array.isRequired,
  itemId: PropTypes.string
};

SecondHeadBar.defaultProps = {
  itemId: ""
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    null,
    { clearAnswers: clearAnswersAction }
  )
);

export default enhance(SecondHeadBar);
