import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col, Button, Spin } from "antd";
import moment from "moment";
import { withWindowSizes } from "@edulastic/common";

const ClassCard = ({ t, classItem, windowWidth }) => {
  const { name, owners, parent, startDate, endDate, subject, grades, active, status, standardSets } = classItem;
  const { name: instructorName } = owners.find(owner => owner.id === parent.id);
  return (
    <Col xs={24} md={12} lg={windowWidth >= 1024 && windowWidth <= 1300 ? 8 : 6} xxl={6}>
      <ManageClassCardContent>
        <CardHeader type="flex" justify="space-between" align="middle">
          <CardTitle title="Class Name">{name}</CardTitle>
          {/* passing classItem as props to Assignments route */}
          <InfoContent span={16} status={status}>
            <span>{status === "1" ? "ACTIVE" : "NOT ENROLLED"}</span>
          </InfoContent>
        </CardHeader>
        <CardBody>
          <Col xs={12} md={12} lg={12} xxl={12} span={24}>
            <InfoLabel span={8}>{t("common.instructor")}</InfoLabel>
            <InfoContent span={16} info>
              {instructorName}
            </InfoContent>
          </Col>

          {grades.length ? (
            <Col xs={12} md={12} lg={12} xxl={12} span={24}>
              <InfoLabel span={8}>{t("common.grade")}</InfoLabel>
              <InfoContent span={16} info>
                {grades.join(", ").replace(/O/i, " Other ")}
              </InfoContent>
            </Col>
          ) : (
            ""
          )}

          <Col xs={12} md={12} lg={12} xxl={12} span={24}>
            <InfoLabel span={8}>{t("common.subject")}</InfoLabel>
            <InfoContent span={16} info>
              {subject}
            </InfoContent>
          </Col>

          {standardSets.length ? (
            <Col xs={12} md={12} lg={12} xxl={12} span={24}>
              <InfoLabel span={8}>{t("common.standard")}</InfoLabel>
              <InfoContent span={16} info>
                {standardSets && standardSets.map(std => std.name).join(",")}
              </InfoContent>
            </Col>
          ) : null}

          <Col xs={12} md={12} lg={12} xxl={12} span={24}>
            <InfoLabel span={8}>{t("common.startDate")}</InfoLabel>
            <InfoContent span={16} info>
              {startDate && moment(startDate).format("DD MMM,YYYY")}
            </InfoContent>
          </Col>

          <Col xs={12} md={12} lg={12} xxl={12} span={24}>
            <InfoLabel span={8}>{t("common.endDate")}</InfoLabel>
            <InfoContent span={16} info>
              {endDate && moment(endDate).format("DD MMM,YYYY")}
            </InfoContent>
          </Col>

          <Link to={{ pathname: "/home/assignments", classItem }}>
            <VisitClassButton>{t("common.visitClass")}</VisitClassButton>
          </Link>
        </CardBody>
      </ManageClassCardContent>
    </Col>
  );
};

export default withWindowSizes(ClassCard);

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
  padding: 15px 16px 15px 24px;
  border-bottom: 1px solid ${props => props.theme.classCard.cardHeaderBorderColor};
  display: flex;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.classCard.cardTitleTextSize};
  color: ${props => props.theme.classCard.cardTitleColor};
  font-weight: bold;
  margin: 0px;
  width: 50%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const VisitClassButton = styled(Button)`
  width: 100%;
  height: 36px;
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
  line-height: 25px;
`;

const InfoContent = styled(InfoLabel)`
  width: 50%;
  text-align: right;
  color: ${props =>
    props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardUserInfoContentColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  span {
    border-radius: 5px;
    background-color: ${props => (props.status === "0" ? "lightgrey" : props.theme.classCard.cardActiveStatusBgColor)};
    padding: 4.8px 25px;
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
        font-size: 12px;
        font-weight: 600;
        margin-top: -3.7px;
      `;
    }
  }}
`;
