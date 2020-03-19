import { CheckboxLabel } from "@edulastic/common";
import { Col, Row } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { ColWrapper, StyledCard } from "./styled";

const ListCard = ({ item, onPerformanceBandUpdate, owner, isEditable }) => (
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
        <CheckboxLabel disabled={!owner || !isEditable} onChange={onPerformanceBandUpdate} />
      </ColWrapper>
      <ColWrapper span={6}>{item.from}</ColWrapper>
      <ColWrapper span={6}>{item.bands}</ColWrapper>
    </Row>
  </StyledCard>
);

ListCard.propTypes = {
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  item: PropTypes.object.isRequired
};

export default ListCard;
