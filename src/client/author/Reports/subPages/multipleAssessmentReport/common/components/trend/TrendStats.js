import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col, Menu, Dropdown } from "antd";

import { EduButton } from "@edulastic/common";

import { StyledCard, StyledH3 } from "../../../../../common/styled";
import TrendCard from "./TrendCard";
import { trendTypes } from "../../utils/constants";

const TrendStats = ({ trendCount, onTrendSelect, selectedTrend, renderFilters, heading, setShowAddToGroupModal }) => {
  const trends = Object.keys(trendTypes);

  const menu = (
    <Menu>
      <Menu.Item key="add-to-group" onClick={() => setShowAddToGroupModal(true)}>
        Add to Group
      </Menu.Item>
      {/* <Menu.Item key="remove-from-group">
        Remove from Group
      </Menu.Item> */}
    </Menu>
  );

  return (
    <UpperContainer>
      <PaddedContainer>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>{heading}</StyledH3>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
          >
            <Dropdown overlay={menu}>
              <EduButton height="32px" width="180px">
                Actions
              </EduButton>
            </Dropdown>
            {renderFilters()}
          </Col>
        </Row>
      </PaddedContainer>
      <TrendContainer>
        {trends.map(trend => (
          <Col span={8}>
            <PaddedContainer>
              <TrendCard
                type={trend}
                count={trendCount[trend]}
                onClick={() => onTrendSelect(trend)}
                isSelected={selectedTrend ? selectedTrend === trend : true}
              />
            </PaddedContainer>
          </Col>
        ))}
      </TrendContainer>
    </UpperContainer>
  );
};

TrendStats.propTypes = {
  onTrendSelect: PropTypes.func,
  selectedTrend: PropTypes.string,
  renderFilters: PropTypes.func,
  heading: PropTypes.string,
  trendCount: PropTypes.shape({
    up: PropTypes.number,
    flat: PropTypes.number,
    down: PropTypes.number
  })
};

TrendStats.defaultProps = {
  trendCount: {
    up: 0,
    flat: 0,
    down: 0
  },
  selectedTrend: "",
  onTrendSelect: () => {},
  renderFilters: () => null,
  heading: ""
};

export default TrendStats;

const UpperContainer = styled(StyledCard)`
  .ant-card-body {
    padding: 18px 0px;
  }
`;
const PaddedContainer = styled.div`
  padding: 0px 18px;
`;

const TrendContainer = styled(Row)`
  margin-top: 15px;
  padding-top: 5px;
`;
