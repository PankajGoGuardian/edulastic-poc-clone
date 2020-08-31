/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFolderAll = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path fill="none" className="a" d="M0,0H24V24H0Z" />
    <path
      fill="#7c848e"
      className="b"
      d="M20,6H12L10,4H4A2.006,2.006,0,0,0,2,6V18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V8A2.006,2.006,0,0,0,20,6ZM17.94,17,15,15.28,12.06,17l.78-3.33-2.59-2.24,3.41-.29L15,8l1.34,3.14,3.41.29-2.59,2.24Z"
    />
  </SVG>
);

export default withIconStyles(IconFolderAll);
