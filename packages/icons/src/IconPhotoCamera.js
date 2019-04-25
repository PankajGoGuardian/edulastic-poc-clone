/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPhotoCamera = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.84 15.872" {...props}>
    <g transform="translate(0 -10)">
      <g transform="translate(0 10)">
        <path
          d="M9.92,15.952A2.976,2.976,0,1,0,12.9,18.928,2.976,2.976,0,0,0,9.92,15.952Zm7.936-2.976H15.475a.883.883,0,0,1-.783-.565l-.615-1.847A.884.884,0,0,0,13.293,10H6.547a.883.883,0,0,0-.783.565l-.615,1.847a.884.884,0,0,1-.783.564H1.984A1.99,1.99,0,0,0,0,14.96v8.928a1.99,1.99,0,0,0,1.984,1.984H17.856a1.99,1.99,0,0,0,1.984-1.984V14.96A1.99,1.99,0,0,0,17.856,12.976ZM9.92,23.888a4.96,4.96,0,1,1,4.96-4.96A4.96,4.96,0,0,1,9.92,23.888Zm7.241-7.54a.694.694,0,1,1,.694-.694A.694.694,0,0,1,17.161,16.347Z"
          transform="translate(0 -10)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconPhotoCamera);
