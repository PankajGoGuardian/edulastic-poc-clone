import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { MainTitle } from "../Sidebar/styled";
import { SummaryTextArea } from "../../common/SummaryForm";

const Description = ({ windowWidth, description, onChangeField }) => (
  <Container windowWidth={windowWidth}>
    <MainTitle>Description</MainTitle>
    <SummaryTextArea
      value={description}
      onChange={e => onChangeField("description", e.target.value)}
      size="large"
      placeholder="Enter a description"
    />
  </Container>
);

Description.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  onChangeField: PropTypes.func.isRequired
};

export default Description;

const Container = styled.div`
  .ant-table-body {
    font-size: 13px;
    font-weight: 600;
  }
`;
