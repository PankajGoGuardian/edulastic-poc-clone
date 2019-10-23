import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { Row, Col, Tooltip, Button } from "antd";
import { Link } from "react-router-dom";
import { themeColor, black, mobileWidthMax } from "@edulastic/colors";
import {
  getPartnerGetStartedUrl,
  getDistrictGetStartedUrl,
  isDistrictPolicyAllowed
} from "../../../common/utils/helpers";

const Header = ({ t, Partners, isSignupUsingDaURL, districtPolicy, districtShortName, generalSettings }) => (
  <RegistrationHeader type="flex" align="middle">
    <Col span={12}>
      <img
        src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png"
        alt="Edulastic"
        className="edulastic-banner"
      />
      {Partners.name !== "login" && <PartnerLogo Partners={Partners} src={Partners.headerLogo} alt={Partners.name} />}
      {isSignupUsingDaURL ? (
        <div className="district-name-and-announcement">
          <Row type="flex">
            <Col className="district-name">{generalSettings.name}</Col>
            <Col>
              <StyledCustomTooltip placement="bottom" title={generalSettings.announcement} trigger="click">
                <Button icon="bell" type="link" className="district-announcement-button">
                  District Announcement
                </Button>
              </StyledCustomTooltip>
            </Col>
          </Row>
        </div>
      ) : null}
    </Col>
    <Col span={12} align="right">
      {isSignupUsingDaURL &&
      (!isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") &&
        !isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp")) ? (
        <div className="teacher-student-restricted-message">
          {`${t("common.policyviolation").split(".")[0]}.`}
          <br />
          {`${t("common.policyviolation").split(".")[1]}.`}
        </div>
      ) : (
        <>
          <DontHaveAccountText>{t("common.donthaveanaccount")}</DontHaveAccountText>
          <Link
            to={
              isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ||
              isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp")
                ? getDistrictGetStartedUrl(districtShortName)
                : getPartnerGetStartedUrl(Partners)
            }
          >
            {t("common.signupbtn")}
          </Link>
        </>
      )}
    </Col>
  </RegistrationHeader>
);

Header.propTypes = {
  t: PropTypes.func.isRequired,
  partnerCheck: PropTypes.any,
  Partners: PropTypes.object
};

const enhance = compose(withNamespaces("login"));

export default enhance(Header);

const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;

  .edulastic-banner {
    margin-right: 10px;
  }

  .district-name-and-announcement {
    display: inline-block;
    vertical-align: middle;

    .district-name {
      padding: 4px;
      margin-right: 10px;
    }

    .district-announcement-button {
      border: none;
      color: white;
      font-size: 14px;
      padding: 0;
      span {
        font-size: 14px;
      }
    }
  }

  .teacher-student-restricted-message {
    display: inline-block;
    text-align: left;
  }

  span {
    font-size: 14px;
    margin-right: 20px;
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    border-radius: 4px;
    background: ${themeColor};
    font-size: 11px;

    @media (max-width: ${mobileWidthMax}) {
      padding: 8px 35px;
      font-size: 11px;
    }
  }
`;

const DontHaveAccountText = styled.span`
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

const PartnerLogo = styled.img`
  filter: ${props => props.Partners.colorFilter};
  margin-left: 10px;
  max-height: 30px;
`;

const CustomTooltip = props => {
  let { className, children, ...attrs } = props;

  return (
    <Tooltip {...attrs} overlayClassName={`${className}`}>
      {children}
    </Tooltip>
  );
};

const StyledCustomTooltip = styled(CustomTooltip)`
  max-width: 300px;

  .ant-tooltip-content {
    .ant-tooltip-arrow {
      border-bottom-color: white;
    }
    .ant-tooltip-inner {
      background-color: white;
      color: ${black};
      .custom-table-tooltip-value {
        font-weight: 900;
        margin-left: 5px;
      }
    }
  }
`;
