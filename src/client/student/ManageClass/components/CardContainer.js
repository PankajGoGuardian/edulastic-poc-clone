import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col, Button, Tooltip, Collapse } from "antd";
import moment from "moment";
import { withWindowSizes } from "@edulastic/common";
import { smallDesktopWidth, themeColor } from "@edulastic/colors";
import { changeClassAction } from "../../Login/ducks";

const ClassCard = ({ t, classItem, history, changeClass, key }) => {
  const {
    name,
    owners = [],
    parent,
    startDate,
    endDate,
    subject,
    grades,
    active,
    status,
    standardSets,
    institutionName,
    districtName
  } = classItem;
  const { name: instructorName } = owners.find(owner => owner.id === parent.id) || owners[0] || "";

  const allgrades = grades && grades.join(", ").replace(/O/i, " Other ");
  const allStandardSets = standardSets && standardSets.map(std => std.name).join(",");
  const handleVisitClass = () => {
    changeClass(classItem._id);
    sessionStorage.setItem("temporaryClass", classItem._id);
    if (active === 1) {
      return history.push("/home/assignments");
    }
    if (active === 0) {
      return history.push("/home/grades");
    }
  };

  const { Panel } = Collapse;

  return (
    <CollapsibleCard defaultActiveKey={key} expandIconPosition="right">
      <Panel
        header={
          <Row type="flex" justify="space-between" align="center">
            <Col span={12}>
              <Row type="flex" justify="start">
                <EllipsisContainer status={status}>
                  <Tooltip placement="bottomLeft" title={name}>
                    <CardTitle>{name}</CardTitle>
                  </Tooltip>
                  <ClassStatus status={status}>
                    <span>{status == "1" ? "ACTIVE" : "NOT ENROLLED"}</span>
                  </ClassStatus>
                </EllipsisContainer>
              </Row>
            </Col>
            <Col span={12}>
              <Row type="flex" justify="end" align="center">
                <EllipsisContainer>
                  <InstitutionInfo>
                    {institutionName}, {districtName}
                  </InstitutionInfo>
                  <VisitClassButton onClick={handleVisitClass}>{t("common.visitClass")}</VisitClassButton>
                </EllipsisContainer>
              </Row>
            </Col>
          </Row>
        }
        key={key}
      >
        <ManageClassCardContent gutter={20}>
          <Col span={8}>
            <Row type="flex" align="middle">
              <InfoLabel xs={24} md={8} xxl={6}>
                {t("common.instructor")}
              </InfoLabel>
              <Tooltip placement="bottomLeft" title={instructorName}>
                <InfoContent xs={24} md={16} xxl={18}>
                  {instructorName}
                </InfoContent>
              </Tooltip>
            </Row>

            {grades.length ? (
              <Row type="flex" align="middle">
                <InfoLabel xs={24} md={8} xxl={6}>
                  {t("common.grade")}
                </InfoLabel>
                <Tooltip placement="bottomLeft" title={allgrades}>
                  <InfoContent xs={24} md={16} xxl={18}>
                    {allgrades}
                  </InfoContent>
                </Tooltip>
              </Row>
            ) : (
              ""
            )}
          </Col>

          <Col span={8}>
            <Row type="flex" align="middle">
              <InfoLabel xs={24} md={8} xxl={6}>
                {t("common.subject")}
              </InfoLabel>
              <Tooltip placement="bottomLeft" title={subject}>
                <InfoContent xs={24} md={16} xxl={18}>
                  {subject}
                </InfoContent>
              </Tooltip>
            </Row>

            {standardSets.length ? (
              <Row type="flex" align="middle">
                <InfoLabel xs={24} md={8} xxl={6}>
                  {t("common.standard")}
                </InfoLabel>
                <Tooltip placement="bottomLeft" title={allStandardSets}>
                  <InfoContent xs={24} md={16} xxl={18}>
                    {allStandardSets}
                  </InfoContent>
                </Tooltip>
              </Row>
            ) : null}
          </Col>

          <Col span={8}>
            <Row type="flex" align="middle">
              <InfoLabel xs={24} md={8} xxl={6}>
                {t("common.startDate")}
              </InfoLabel>
              <InfoContent xs={24} md={16} xxl={18}>
                {startDate && moment(startDate).format("MMM DD, YYYY")}
              </InfoContent>
            </Row>
            <Row type="flex" align="middle">
              <InfoLabel xs={24} md={8} xxl={6}>
                {t("common.endDate")}
              </InfoLabel>
              <InfoContent xs={24} md={16} xxl={18}>
                {endDate && moment(endDate).format("MMM DD, YYYY")}
              </InfoContent>
            </Row>
          </Col>
        </ManageClassCardContent>
      </Panel>
    </CollapsibleCard>
  );
};

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    null,
    {
      changeClass: changeClassAction
    }
  )
);

export default enhance(ClassCard);

ClassCard.propTypes = {
  t: PropTypes.func.isRequired
};

const CollapsibleCard = styled(Collapse)`
  width: 100%;
  border: none;
  background: white;
  border-radius: 5px;
  margin-bottom: 5px;
  & > .ant-collapse-item {
    border: none;
  }
  .ant-collapse-arrow {
    svg {
      fill: ${themeColor};
    }
  }
`;

const EllipsisContainer = styled.div`
  padding-right: ${props => (props.status ? (props.status === 1 ? "100px" : "140px") : "0px")};
  display: inline-flex;
  align-items: center;
  position: relative;
  max-width: 100%;
`;

const VisitClassButton = styled(Button)`
  height: 32px;
  border-radius: 4px;
  background-color: ${props => props.theme.classCard.cardVisitClassBtnBgColor};
  text-transform: uppercase;
  padding: 0px 30px;
  font-size: ${props => props.theme.classCard.cardVisitClassBtnTextSize};
  color: ${props => props.theme.classCard.cardVisitClassBtnTextColor};
  border: 1px solid ${props => props.theme.classCard.cardVisitClassBtnBorderColor};
  font-weight: 600;

  &:active,
  &:focus,
  &:hover {
    background-color: ${props => props.theme.classCard.cardVisitClassBtnBgHoverColor};
    color: ${props => props.theme.classCard.cardVisitClassBtnTextHoverColor};
    border: 1px solid ${props => props.theme.classCard.cardVisitClassBtnBorderColor};
  }

  @media (max-width: ${smallDesktopWidth}) {
    height: 28px;
    padding: 0px 20px;
  }
`;

const ClassStatus = styled(Col)`
  display: inline-block;
  font-size: ${props => props.theme.classCard.cardUserInfoLabelTextSize};
  font-weight: 700;
  color: ${props => props.theme.classCard.cardUserInfoLabelColor};
  line-height: ${props => (props.theme.zoomLevel == "xs" ? "25px" : "unset")};
  text-transform: uppercase;
  text-align: right;
  color: ${props =>
    props.info ? props.theme.classCard.cardInfoContentColor : props.theme.classCard.cardUserInfoContentColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  top: 0px;
  right: 0px;
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

  @media (max-width: ${smallDesktopWidth}) {
    height: 28px;
    span {
      padding: ${props => (props.status == "0" ? "0px 10px" : "3px 24px")};
    }
  }
`;

const ManageClassCardContent = styled(Row)`
  background: ${props => props.theme.classCard.cardBg};
  text-align: center;
  padding: 10px 15px;
  text-align: left;
`;

const InfoLabel = styled(Col)`
  font-size: ${props => props.theme.classCard.cardUserInfoLabelTextSize};
  font-weight: 700;
  color: ${props => props.theme.classCard.cardUserInfoLabelColor};
  line-height: ${props => (props.theme.zoomLevel == "xs" ? "25px" : "unset")};
  text-transform: uppercase;
  margin: 5px 0px;
`;

const InfoContent = styled(Col)`
  color: ${props => props.theme.classCard.cardUserInfoContentColor};
  font-size: ${props => props.theme.classCard.cardUserInfoFontSize};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 600;
  margin: 5px 0px;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.classCard.cardTitleTextSize};
  color: ${props => props.theme.classCard.cardTitleColor};
  font-weight: bold;
  margin: 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 32px;

  @media (max-width: ${smallDesktopWidth}) {
    line-height: 28px;
  }
`;

const InstitutionInfo = styled.h3`
  font-size: ${props => props.theme.classCard.cardInstitutionInfoTextSize};
  color: ${props => props.theme.classCard.cardInstitutionInfoTextColor};
  font-weight: bold;
  margin: 0px;
  padding-left: 25px;
  padding-right: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 32px;

  @media (max-width: ${smallDesktopWidth}) {
    line-height: 28px;
  }
`;
