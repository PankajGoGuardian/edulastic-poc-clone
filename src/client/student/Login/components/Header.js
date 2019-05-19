import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { springGreen } from "@edulastic/colors";

const Header = ({ t }) => (
  <RegistrationHeader type="flex" align="middle">
    <Col span={12}>
      <img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" />
    </Col>
    <Col span={12} align="right">
      <span>{t("common.donthaveanaccount")}</span>
      <Link to="/getstarted">{t("common.signupbtn")}</Link>
    </Col>
  </RegistrationHeader>
);

Header.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("login"));

export default enhance(Header);

const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;
  span {
    font-size: 12px;
    margin-right: 20px;
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    border-radius: 4px;
    background: ${springGreen};
  }
`;
