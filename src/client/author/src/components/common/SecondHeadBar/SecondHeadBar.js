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
  constructor(props) {
    super(props);

    this.state = {
      breadcrumbData: [
        {
          title: "ITEM BANK",
          to: "/author/items"
        },
        // eslint-disable-next-line react/destructuring-assignment
        ...this.props.breadcrumb
      ]
    };
  }

  render() {
    const { breadcrumbData } = this.state;

    return (
      <Container>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset", width: "100%" }} />
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
      title: "ITEM DETAIL",
      to: `/author/items/${window.location.pathname.split("/")[3]}/item-detail`
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
