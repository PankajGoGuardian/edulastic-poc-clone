import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col, Button, Spin, Tooltip } from "antd";
import moment from "moment";
import { withWindowSizes } from "@edulastic/common";
import { connect } from "react-redux";
import { changeClassAction } from "../../Login/ducks";
import ColWithZoom from "../../../common/components/ColWithZoom";

const ClassCard = ({ t, classItem, windowWidth, history, changeClass }) => {
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
    <ColWithZoom xs={24} md={12} lg={windowWidth >= 1024 && windowWidth <= 1300 ? 8 : 6} xxl={6}>
      <ManageClassCardContent>
        <CardHeader>
          <Col span={15}>
            <Tooltip placement="bottomLeft" title={name}>
              <CardTitle>{name}</CardTitle>
            </Tooltip>
          </Col>
          <Col span={9}>
            <InfoContent width={100} status={status}>
              <span>{status === "1" ? "ACTIVE" : "NOT ENROLLED"}</span>
            </InfoContent>
          </Col>
        </CardHeader>
        <CardBody>
          <Col span={12}>
            <InfoLabel span={8}>{t("common.instructor")}</InfoLabel>
            <Tooltip placement="bottomLeft" title={instructorName}>
              <InfoContent span={16} info>
                {instructorName}
              </InfoContent>
            </Tooltip>
          </Col>

          {grades.length ? (
            <Col span={12}>
              <InfoLabel span={8}>{t("common.grades")}</InfoLabel>
              <Tooltip placement="bottomLeft" title={allgrades}>
                <InfoContent span={16} info>
                  {allgrades}
                </InfoContent>
              </Tooltip>
            </Col>
          ) : (
            ""
          )}

          <Col span={12}>
            <InfoLabel span={8}>{t("common.subject")}</InfoLabel>
            <Tooltip placement="bottomLeft" title={subject}>
              <InfoContent span={16} info>
                {subject}
              </InfoContent>
            </Tooltip>
          </Col>

          {standardSets.length ? (
            <Col span={12}>
              <InfoLabel span={8}>{t("common.standard")}</InfoLabel>
              <Tooltip placement="bottomLeft" title={allStandardSets}>
                <InfoContent span={16} info>
                  {allStandardSets}
                </InfoContent>
              </Tooltip>
            </Col>
          ) : null}

          <Col span={12}>
            <InfoLabel span={8}>{t("common.startDate")}</InfoLabel>
            <InfoContent span={16} info>
              {startDate && moment(startDate).format("MMM DD, YYYY")}
            </InfoContent>
          </Col>

          <Col span={12}>
            <InfoLabel span={8}>{t("common.endDate")}</InfoLabel>
            <InfoContent span={16} info>
              {endDate && moment(endDate).format("MMM DD, YYYY")}
            </InfoContent>
          </Col>

          {active === 1 && (
            <Link to={{ pathname: "/home/assignments", classItem }}>
              <VisitClassButton>{t("common.visitClass")}</VisitClassButton>
            </Link>
          )}

          {active === 0 && <VisitClassButton onClick={handleVisitClass}>{t("common.visitClass")}</VisitClassButton>}
        </CardBody>
      </ManageClassCardContent>
    </ColWithZoom>
  );
};

export default connect(
  state => {},
  {
    changeClass: changeClassAction
  }
)(withWindowSizes(withRouter(ClassCard)));

ClassCard.propTypes = {
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const ManageClassCardContent = styled.div`
  background: ${props => props.theme.classCard.cardBg};
  min-height: 270px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.classCard.cardHeaderBorderColor};
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
  width: 100%;
  height: ${props => (props.theme.zoomLevel == "xs" ? "36px" : "auto")};
  line-height: 36px;
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

  ${({ theme }) =>
    theme.zoomedCss`
      padding: 10px 0px;
    `}
`;

const CardBody = styled(Row)`
  padding: 15px 25px 17px;
`;

const InfoLabel = styled(Col)`
  display: block;
  width: 100%;
  font-size: ${props => props.theme.classCard.cardUserInfoLabelTextSize};
  font-weight: 700;
  text-align: center;
  color: ${props => props.theme.classCard.cardUserInfoLabelColor};
  line-height: ${props => (props.theme.zoomLevel == "xs" ? "25px" : "none")};
`;

const InfoContent = styled(InfoLabel)`
  width: ${props => (props.width ? `${props.width}%` : "50%")};
  text-align: right;
  color: ${props =>
    props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardUserInfoContentColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  span {
    width: 100%;
    text-align: center;
    border-radius: 5px;
    background-color: ${props => (props.status === "0" ? "lightgrey" : props.theme.classCard.cardActiveStatusBgColor)};
    padding: 4.8px 3px;
    font-size: 10px;
    color: ${props =>
      props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardActiveStatusTextColor};
    font-size: ${props => props.theme.classCard.cardActiveStatusTextSize};
  }

  ${({ info }) => {
    if (info) {
      return `
        display: block;
        width: 100%;
        text-align: center;
        font-size: ${props => props.theme.classCard.cardUserInfoContentSize};
        font-weight: 600;
        margin-top: -3.7px;
      `;
    }
  }}
`;
