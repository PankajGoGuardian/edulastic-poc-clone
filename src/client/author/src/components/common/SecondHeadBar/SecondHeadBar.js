import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { compose } from "redux";

import { clearAnswersAction } from "../../../actions/answers";
import Breadcrumb from "../../Breadcrumb";
import { Container } from "./styled_components";

const breadCrumbTarget = `/author/items/${window.location.pathname.split("/")[3]}/item-detail`;
class SecondHeadBar extends Component {
  render() {
    let { breadcrumb, breadCrumbQType } = this.props;
    if (breadCrumbQType) {
      breadcrumb = [...breadcrumb, { title: breadCrumbQType, to: breadCrumbTarget }];
    }
    return (
      <Container padding="0px">
        <Breadcrumb data={breadcrumb} style={{ position: "unset", width: "100%" }} />
        {this.props.children ? this.props.children : null}
      </Container>
    );
  }
}

SecondHeadBar.propTypes = {
  breadcrumb: PropTypes.array
};

SecondHeadBar.defaultProps = {
  breadcrumb: [
    {
      title: "ITEM BANK",
      to: "/author/items"
    },
    {
      title: "ITEM DETAIL",
      to: breadCrumbTarget
    }
  ]
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
