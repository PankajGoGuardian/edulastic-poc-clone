import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Row, Col } from "antd";

import { StyledCard, StyledH3 } from "../../../../../common/styled";
import TrendCard from "./TrendCard";
import { trendTypes } from "../../utils/constants";

const TrendStats = ({ trendCount, onTrendSelect, selectedTrend }) => {
  const trends = Object.keys(trendTypes);

  return (
    <UpperContainer>
      <PaddedContainer>
        <StyledH3>Distribution of student subgroup as per progress trend ?</StyledH3>
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
  onTrendSelect: () => {}
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
  padding-top: 5px;
`;
