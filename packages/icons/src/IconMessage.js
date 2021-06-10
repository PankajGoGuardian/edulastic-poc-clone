/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconMessage = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="14.701" height="14.664" viewBox="0 0 14.701 14.664" {...props}>
    <path
      d="M162.138,154.4a6.565,6.565,0,0,1-.282-.7h.021a6.588,6.588,0,0,1,5.926-8.689h0a6.581,6.581,0,1,1,.316,13.155,6.51,6.51,0,0,1-2.8-.63c-3.43.678-3.163.63-3.241.63a.564.564,0,0,1-.553-.675Z"
      transform="translate(-160.738 -144.251)"
      fill="#66717a"
      stroke="#66717a"
      strokeWidth="1.5"
    />
  </SVG>
);

export default withIconStyles(IconMessage);
