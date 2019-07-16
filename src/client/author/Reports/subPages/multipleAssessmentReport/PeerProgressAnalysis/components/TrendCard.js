import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { trendTypes } from "../utils/constants";
import { StyledTrendIcon } from "./styled";

const TrendCard = ({ count, type, ...restProps }) => {
  return (
    <div {...restProps}>
      {count} <StyledTrendIcon type={type} className="fa fa-arrow-up" />
    </div>
  );
};

const StyledTrendCard = styled(TrendCard)`
  height: 63px;
  padding: 15px;
  text-align: center;
  font-size: 30px;
  line-height: 30px;
  border-radius: 5px;
  color: #676a6c;
  background-color: ${props => trendTypes[props.type].color};
`;

StyledTrendCard.propTypes = {
  count: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(trendTypes))
};

StyledTrendCard.defaultProps = {
  count: 0,
  type: "flat"
};

export default StyledTrendCard;
