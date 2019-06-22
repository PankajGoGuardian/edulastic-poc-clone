/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFolderNew = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <path className="a" d="M0,0H20V20H0Z" fill="none" />
    <path
      fill="#00AD50"
      className="b"
      d="M16.4,5.5H10L8.4,4H3.6A1.54,1.54,0,0,0,2.008,5.5L2,14.5A1.547,1.547,0,0,0,3.6,16H16.4A1.547,1.547,0,0,0,18,14.5V7A1.547,1.547,0,0,0,16.4,5.5Zm-.8,6H13.2v2.25H11.6V11.5H9.2V10h2.4V7.75h1.6V10h2.4Z"
    />
  </SVG>
);

export default withIconStyles(IconFolderNew);
