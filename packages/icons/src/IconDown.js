import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDown = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" {...props}>
    <path d="M1277 1299q8 19-5 35l-350 384q-10 10-23 10-14 0-24-10l-355-384q-13-16-5-35 9-19 29-19h224v-1248q0-14 9-23t23-9h192q14 0 23 9t9 23v1248h224q21 0 29 19z" />
  </SVG>
);

export default withIconStyles(IconDown);
