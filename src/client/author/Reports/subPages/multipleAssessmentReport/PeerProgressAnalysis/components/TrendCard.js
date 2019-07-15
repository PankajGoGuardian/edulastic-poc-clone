import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const trendTypes = {
  up: {
    color: "#99cb76",
    rotation: 45
  },
  flat: {
    color: "#ffe6c0",
    rotation: 90
  },
  down: {
    color: "#eb7b65",
    rotation: 135
  }
};

const TrendCard = ({ count, ...restProps }) => {
  return (
    <div {...restProps}>
      {count} <i className="fa fa-arrow-up" />
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

  i {
    transform: rotate(${props => trendTypes[props.type].rotation}deg);
  }
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
