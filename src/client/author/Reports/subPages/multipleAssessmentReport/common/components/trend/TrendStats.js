import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col } from "antd";

import { EduButton } from "@edulastic/common";
import { IconPlusCircle } from "@edulastic/icons";

import { StyledCard, StyledH3 } from "../../../../../common/styled";
import TrendCard from "./TrendCard";
import { trendTypes } from "../../utils/constants";
import FeaturesSwitch from "../../../../../../../features/components/FeaturesSwitch";

const TrendStats = ({ trendCount, onTrendSelect, selectedTrend, renderFilters, heading, handleAddToGroupClick }) => {
  const trends = Object.keys(trendTypes);

  return (
    <UpperContainer>
      <PaddedContainer>
        <Row>
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <StyledH3>{heading}</StyledH3>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={14}
            xl={14}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end" }}
          >
            {!!handleAddToGroupClick && (
              <FeaturesSwitch inputFeatures="studentGroups" actionOnInaccessible="hidden">
                <EduButton
                  style={{ height: "32px", padding: "0 15px 0 10px", marginRight: "5px" }}
                  onClick={handleAddToGroupClick}
                >
                  <IconPlusCircle /> Add To Student Group
                </EduButton>
              </FeaturesSwitch>
            )}
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
  onTrendSelect: () => { },
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
