import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconWrite = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="22.707" height="22.969" viewBox="0 0 22.707 22.969" {...props}>
    <path
      className="a"
      d="M22.125,3.459a3.465,3.465,0,0,0-5.917-2.445l-13.947,14a4.151,4.151,0,0,0-1,1.623l-.013.04L0,22.162l5.5-1.231.041-.014a4.158,4.158,0,0,0,1.625-1l13.949-14a3.442,3.442,0,0,0,1.013-2.451ZM3.048,19.706l-.583-.583.421-1.851L4.9,19.291ZM19.886,4.689,6.344,18.285,3.892,15.831l9.276-9.313,1.413,1.413L15.8,6.707,14.389,5.292l1.316-1.321,1.418,1.418,1.223-1.223-1.42-1.42.507-.509a1.735,1.735,0,1,1,2.454,2.452ZM9.1,20.413H22.125v1.73H7.377Zm0,0"
      transform="translate(0.332 0.477)"
    />
  </SVG>
);

export default withIconStyles(IconWrite);
