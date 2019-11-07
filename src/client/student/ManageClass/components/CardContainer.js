import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { withWindowSizes } from "@edulastic/common";
import { tabletWidth, smallDesktopWidth, extraDesktopWidthMax } from "@edulastic/colors";
import { changeClassAction } from "../../Login/ducks";

const ClassCard = ({ t, classItem, history, changeClass }) => {
  const { name, owners, parent, startDate, endDate, subject, grades, active, status, standardSets } = classItem;
  const { name: instructorName } = owners.find(owner => owner.id === parent.id);

  const allgrades = grades && grades.join(", ").replace(/O/i, " Other ");
  const allStandardSets = standardSets && standardSets.map(std => std.name).join(",");
  const handleVisitClass = () => {
    sessionStorage.setItem("temporaryClass", classItem._id);
    history.push("/home/reports");
    changeClass(sessionStorage.temporaryClass);
  };

  return (
    <ManageClassCardContent>
      <CardHeader>
        <Col span={11}>
          <Tooltip placement="bottomLeft" title={name}>
            <CardTitle>{name}</CardTitle>
          </Tooltip>
        </Col>
        <Col span={13}>
          <ClassStatus status={status}>
            <span>{status == "1" ? "ACTIVE" : "NOT ENROLLED"}</span>
          </ClassStatus>
        </Col>
      </CardHeader>
      <Row>
        <Col span={12}>
          <InfoLabel span={8}>{t("common.instructor")}</InfoLabel>
          <Tooltip placement="bottomLeft" title={instructorName}>
            <InfoContent span={16}>{instructorName}</InfoContent>
          </Tooltip>
        </Col>

        {grades.length ? (
          <Col span={12}>
            <InfoLabel span={8}>{t("common.grade")}</InfoLabel>
            <Tooltip placement="bottomLeft" title={allgrades}>
              <InfoContent span={16}>{allgrades}</InfoContent>
            </Tooltip>
          </Col>
        ) : (
          ""
        )}

        <Col span={12}>
          <InfoLabel span={8}>{t("common.subject")}</InfoLabel>
          <Tooltip placement="bottomLeft" title={subject}>
            <InfoContent span={16}>{subject}</InfoContent>
          </Tooltip>
        </Col>

        {standardSets.length ? (
          <Col span={12}>
            <InfoLabel span={8}>{t("common.standard")}</InfoLabel>
            <Tooltip placement="bottomLeft" title={allStandardSets}>
              <InfoContent span={16}>{allStandardSets}</InfoContent>
            </Tooltip>
          </Col>
        ) : null}

        <Col span={12}>
          <InfoLabel span={8}>{t("common.startDate")}</InfoLabel>
          <InfoContent span={16}>{startDate && moment(startDate).format("MMM DD, YYYY")}</InfoContent>
        </Col>

        <Col span={12}>
          <InfoLabel span={8}>{t("common.endDate")}</InfoLabel>
          <InfoContent span={16}>{endDate && moment(endDate).format("MMM DD, YYYY")}</InfoContent>
        </Col>

        {active === 1 && (
          <Link to={{ pathname: "/home/assignments", classItem }}>
            <VisitClassButton>{t("common.visitClass")}</VisitClassButton>
          </Link>
        )}

        {active === 0 && <VisitClassButton onClick={handleVisitClass}>{t("common.visitClass")}</VisitClassButton>}
      </Row>
    </ManageClassCardContent>
  );
};

export default connect(
  state => {},
  {
    changeClass: changeClassAction
  }
)(withWindowSizes(withRouter(ClassCard)));

ClassCard.propTypes = {
  t: PropTypes.func.isRequired
};

const ManageClassCardContent = styled.div`
  background: ${props => props.theme.classCard.cardBg};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.classCard.cardBorderColor};
  width: 255px;
  height: 285px;
  margin: 0 15px 15px 0;
  padding: 5px 15px 5px 20px;
  text-align: center;
  @media (min-width: ${extraDesktopWidthMax}) {
    margin: 0 30px 30px 0;
    width: 300px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 49%;
    &:nth-child(even) {
      margin-right: 0;
    }
    &:nth-child(odd) {
      margin-right: 2%;
    }
  }
  @media (max-width: ${tabletWidth}) {
    width: 100%;
    margin-right: 0;
  }
`;

const CardHeader = styled(Row)`
  padding: 15px 8px;
  border-bottom: 1px solid ${props => props.theme.classCard.cardHeaderBorderColor};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.classCard.cardTitleTextSize};
  color: ${props => props.theme.classCard.cardTitleColor};
  font-weight: bold;
  margin: 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const VisitClassButton = styled(Button)`
  width: 206px;
  height: 36px;
  border-radius: 4px;
  background-color: ${props => props.theme.classCard.cardVisitClassBtnBgColor};
  text-transform: uppercase;
  padding: 0px 20px;
  font-size: ${props => props.theme.classCard.cardVisitClassBtnTextSize};
  color: ${props => props.theme.classCard.cardVisitClassBtnTextColor};
  border: 1px solid ${props => props.theme.classCard.cardVisitClassBtnBorderColor};
  font-weight: 600;
  margin-top: 20px;

  &:active,
  &:focus,
  &:hover {
    background-color: ${props => props.theme.classCard.cardVisitClassBtnBgHoverColor};
    color: ${props => props.theme.classCard.cardVisitClassBtnTextHoverColor};
    border: 1px solid ${props => props.theme.classCard.cardVisitClassBtnBorderColor};
  }
`;

const InfoLabel = styled(Col)`
  display: block;
  width: 100%;
  font-size: ${props => props.theme.classCard.cardUserInfoLabelTextSize};
  font-weight: 700;
  text-align: center;
  color: ${props => props.theme.classCard.cardUserInfoLabelColor};
  line-height: ${props => (props.theme.zoomLevel == "xs" ? "25px" : "unset")};
  text-transform: uppercase;
  margin-top: 12px;
`;

const ClassStatus = styled(Col)`
  display: block;
  font-size: ${props => props.theme.classCard.cardUserInfoLabelTextSize};
  font-weight: 700;
  color: ${props => props.theme.classCard.cardUserInfoLabelColor};
  line-height: ${props => (props.theme.zoomLevel == "xs" ? "25px" : "unset")};
  text-transform: uppercase;
  width: 100%;
  text-align: right;
  color: ${props =>
    props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardUserInfoContentColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  span {
    display: inline-block;
    text-align: center;
    border-radius: 5px;
    background-color: ${props => (props.status == "0" ? "lightgrey" : props.theme.classCard.cardActiveStatusBgColor)};
    padding: ${props => (props.status == "0" ? "5px 10px" : "5px 24px")};
    color: ${props =>
      props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardActiveStatusTextColor};
    font-size: ${props => props.theme.classCard.cardActiveStatusTextSize};
  }
`;

const InfoContent = styled(Col)`
  color: ${props => props.theme.classCard.cardUserInfoContentColor};
  font-size: ${props => props.theme.classCard.cardUserInfoFontSize};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: 600;
  margin-top: 4px;
`;
