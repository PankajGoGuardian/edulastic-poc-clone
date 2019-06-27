import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Checkbox } from "antd";
import { StyledCard, ColWrapper } from "./styled";

const ListCard = ({ item, onPerformanceBandUpdate, owner, readOnlyMode }) => (
  <StyledCard
    bodyStyle={{
      height: 52,
      display: "flex",
      alignItems: "center",
      padding: "0px"
    }}
  >
    <Row style={{ width: "100%" }}>
      <Col span={6} style={{ paddingLeft: 24 }}>
        {item.bands}
      </Col>
      <ColWrapper span={6}>
        <Checkbox disabled={!owner || readOnlyMode} onChange={onPerformanceBandUpdate} />
      </ColWrapper>
      <ColWrapper span={6}>{item.from}</ColWrapper>
      <ColWrapper span={6}>{item.bands}</ColWrapper>
    </Row>
  </StyledCard>
);

ListCard.propTypes = {
  owner: PropTypes.bool,
  readOnlyMode: PropTypes.bool,
  item: PropTypes.object.isRequired
};

export default ListCard;
