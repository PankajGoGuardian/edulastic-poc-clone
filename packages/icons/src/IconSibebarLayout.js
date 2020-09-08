/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconSibebarLayout = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="15.982" height="15.982" viewBox="0 0 15.982 15.982" {...props}>
    <path
      d="M21.984,8H10a2,2,0,0,0-2,2V21.984a2,2,0,0,0,2,2H21.984a2,2,0,0,0,2-2V10A2,2,0,0,0,21.984,8Zm-4,1.332V22.65h-4V9.332ZM9.332,21.984V10A.667.667,0,0,1,10,9.332h2.664V22.65H10A.667.667,0,0,1,9.332,21.984Zm13.318,0a.667.667,0,0,1-.666.666H19.321V9.332h2.664A.667.667,0,0,1,22.65,10Z"
      transform="translate(-8 -8)"
      fill="#66707a"
    />
  </SVG>
);

export default withIconStyles(IconSibebarLayout);
