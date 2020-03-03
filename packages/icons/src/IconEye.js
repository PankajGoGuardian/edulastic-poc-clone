/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconEye = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.396 11.087" {...props}>
    <g transform="translate(0 0)">
      <g transform="translate(0 0)">
        <path
          d="M17.285,98.04c-.155-.213-3.858-5.205-8.587-5.205S.266,97.828.11,98.04a.574.574,0,0,0,0,.677c.155.213,3.858,5.205,8.587,5.205s8.432-4.993,8.587-5.205A.573.573,0,0,0,17.285,98.04ZM8.7,102.775c-3.483,0-6.5-3.314-7.394-4.4.892-1.084,3.9-4.4,7.394-4.4s6.5,3.313,7.394,4.4C15.2,99.463,12.189,102.775,8.7,102.775Z"
          transform="translate(0 -92.835)"
        />
      </g>
      <g transform="translate(5.257 2.103)">
        <g transform="translate(0 0)">
          <path
            d="M158.163,154.725a3.441,3.441,0,1,0,3.441,3.441A3.445,3.445,0,0,0,158.163,154.725Z"
            transform="translate(-154.722 -154.725)"
          />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconEye);
