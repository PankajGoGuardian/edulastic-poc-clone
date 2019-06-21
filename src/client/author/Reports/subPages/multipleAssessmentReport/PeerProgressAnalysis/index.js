import React from "react";
import { Row, Col } from "antd";
import { StyledCard, StyledH3 } from "../../../common/styled";
import TrendCard from "./components/TrendCard";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const PeerProgressAnalysis = props => {
  return (
    <div>
      <StyledCard>
        <StyledH3>Distribution of student subgroup as per progress trend ?</StyledH3>
        <Row>
          <Col span={8}>
            <TrendCard />
          </Col>
          <Col span={8}>
            <TrendCard />
          </Col>
          <Col span={8}>
            <TrendCard />
          </Col>
        </Row>
      </StyledCard>
    </div>
  );
};

export default PeerProgressAnalysis;

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
