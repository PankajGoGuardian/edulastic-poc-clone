/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPrint = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.223 13.129" {...props}>
    <g transform="translate(0 -18.272)">
      <path
        d="M13.74,24.224a1.58,1.58,0,0,0-1.158-.483h-.547V21.553a2.28,2.28,0,0,0-.581-1.4l-1.3-1.3a2.275,2.275,0,0,0-1.4-.581H3.009a.817.817,0,0,0-.821.821v4.65H1.641a1.58,1.58,0,0,0-1.158.483A1.58,1.58,0,0,0,0,25.382v3.556a.263.263,0,0,0,.081.192.263.263,0,0,0,.192.081H2.188v1.368a.817.817,0,0,0,.821.821h8.205a.817.817,0,0,0,.821-.821V29.212h1.915a.277.277,0,0,0,.273-.273V25.382A1.579,1.579,0,0,0,13.74,24.224Zm-2.8,6.081H3.282V28.118h7.658Zm0-5.47H3.282v-5.47h5.47v1.368a.817.817,0,0,0,.821.821h1.368v3.282Zm2.026.932a.536.536,0,1,1,.162-.385A.526.526,0,0,1,12.967,25.767Z"
        transform="translate(0)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconPrint);
