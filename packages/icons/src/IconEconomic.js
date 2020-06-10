/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconEconomic = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="16.839" height="12.07" viewBox="0 0 16.839 12.07" {...props}>
    <path
      d="M220.784,50.24l3.737-3.737,1.646,1.646a1.046,1.046,0,0,0,1.479,0l5.6-5.6v.482a1.046,1.046,0,1,0,2.091,0c0-3.318,0-3.037-.012-3.154a1.045,1.045,0,0,0-.634-.819c-.259-.107-.178-.08-3.406-.08a1.046,1.046,0,0,0,0,2.091h.482l-4.861,4.86-1.646-1.646a1.046,1.046,0,0,0-1.479,0l-4.477,4.477a1.046,1.046,0,0,0,1.479,1.479Z"
      transform="translate(-218.749 -38.726)"
    />
  </SVG>
);

export default withIconStyles(IconEconomic);
