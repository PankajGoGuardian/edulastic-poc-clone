import React from "react";
import PropTypes from "prop-types";

const TrendCard = ({ count, type }) => {
  return <div>{count}</div>;
};

TrendCard.propTypes = {
  count: PropTypes.number,
  type: PropTypes.string
};

TrendCard.defaultProps = {
  count: 0,
  type: "down"
};

export default TrendCard;
