/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconWrench = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="14.017" height="14.018" viewBox="0 0 14.017 14.018" {...props}>
    <g transform="translate(-0.009)">
      <g transform="translate(0.009)">
        <g transform="translate(0)">
          <path
            d="M13.717,2.041a.5.5,0,0,0-.546.109L11.029,4.292,9.8,3.015,11.884.848A.5.5,0,0,0,11.523,0h-3.5a.5.5,0,0,0-.354.147l-2,2a.5.5,0,0,0-.147.354V5.3L.674,10.142a2.271,2.271,0,0,0,3.211,3.211L8.726,8.511h2.8a.5.5,0,0,0,.354-.147l2-2a.5.5,0,0,0,.147-.354V2.5A.5.5,0,0,0,13.717,2.041ZM13.025,5.8,11.316,7.509h-2.8a.5.5,0,0,0-.354.147L3.177,12.645a1.27,1.27,0,1,1-1.824-1.767l.028-.028L6.37,5.861a.5.5,0,0,0,.147-.354V2.71L8.226,1h2.121l-1.6,1.668a.5.5,0,0,0,0,.695l1.919,1.99a.5.5,0,0,0,.356.153.577.577,0,0,0,.358-.147l1.647-1.649V5.8Z"
            transform="translate(-0.009 0)"
          />
        </g>
      </g>
      <g transform="translate(2.005 10.519)">
        <path
          d="M69.4,358.751a.5.5,0,0,0-.7,0l-.5.5a.5.5,0,0,0,.7.72l.012-.012.5-.5A.5.5,0,0,0,69.4,358.751Z"
          transform="translate(-68.054 -358.61)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconWrench);
