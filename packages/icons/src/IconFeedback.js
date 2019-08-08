import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFeedback = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.174 17.757" {...props}>
    <path
      d="M15.465,6.4A10.135,10.135,0,0,0,9.087,4.257,10.135,10.135,0,0,0,2.71,6.4,6.828,6.828,0,0,0,0,11.723a6.828,6.828,0,0,0,2.71,5.323A10.135,10.135,0,0,0,9.087,19.19c.245,0,.491-.008.737-.024l1.548,2.552a.615.615,0,0,0,.511.3H11.9a.614.614,0,0,0,.51-.272l3.277-4.879a6.78,6.78,0,0,0,2.491-5.139A6.828,6.828,0,0,0,15.465,6.4Z"
      transform="translate(0 -4.256)"
    />
  </SVG>
);

export default withIconStyles(IconFeedback);
