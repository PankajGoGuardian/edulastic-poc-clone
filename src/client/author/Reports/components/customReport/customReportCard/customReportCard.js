import React from "react";
import { Avatar, Col, Row } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

const CustomReportCard = ({ reportCards = [], showReport }) => (
  <Row gutter={20} type="flex" wrap="wrap">
    {reportCards.map(reportCard => (
      <StyledReportCard span={8} key={reportCard._id} onClick={() => showReport(reportCard._id, reportCard.title)}>
        <StyledRow type="flex" wrap="wrap">
          <Col span={4}>
            <Avatar size="large" src={reportCard.thumbnail} />
          </Col>
          <Col span={20} title={reportCard.title}>
            <StyledH3>{reportCard.title}</StyledH3>
          </Col>
          <Col span={24} title={reportCard.description}>
            <StyledPara>{reportCard.description}</StyledPara>
          </Col>
        </StyledRow>
      </StyledReportCard>
    ))}
  </Row>
);

CustomReportCard.propTypes = {
  reportCards: PropTypes.array.isRequired
};

export default CustomReportCard;

const StyledReportCard = styled(Col)`
  display: flex;
  border: none;
  margin: 0px 0px 20px;
  cursor: pointer;
`;
const StyledRow = styled(Row)`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 10px 20px;
  width: 100%;
`;

const StyledH3 = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #4a5263;
  margin: 0px;
`;

const StyledPara = styled.p`
  height: 65px;
  margin-top: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
`;
