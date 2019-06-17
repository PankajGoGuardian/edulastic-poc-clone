/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDraft = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.502 16.503" {...props}>
    <path
      d="M22892,15.693h-11a2,2,0,0,1-2-2v-11a2,2,0,0,1,2-2h5.941V8.631H22894v5.062A2,2,0,0,1,22892,15.693Z"
      transform="translate(-22878.25 0.06)"
      fill="#fff"
      stroke="#a5acb4"
      stroke-width="1.5"
    />
  </SVG>
);

export default withIconStyles(IconDraft);
