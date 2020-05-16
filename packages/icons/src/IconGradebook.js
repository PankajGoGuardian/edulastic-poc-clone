/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconGradebook = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.895 21.395" {...props}>
    <path
      className="a"
      d="M19.413,0H2.483A2.485,2.485,0,0,0,0,2.483v4.93A2.485,2.485,0,0,0,2.483,9.9h16.93A2.485,2.485,0,0,0,21.9,7.413V2.483A2.485,2.485,0,0,0,19.413,0Zm.805,7.413a.806.806,0,0,1-.805.805H2.483a.806.806,0,0,1-.805-.805V2.483a.806.806,0,0,1,.805-.805h16.93a.806.806,0,0,1,.805.805Z"
    />
    <g transform="translate(0 11.5)">
      <path
        className="a"
        d="M19.413,0H2.483A2.485,2.485,0,0,0,0,2.483v4.93A2.485,2.485,0,0,0,2.483,9.9h16.93A2.485,2.485,0,0,0,21.9,7.413V2.483A2.485,2.485,0,0,0,19.413,0Zm.805,7.413a.806.806,0,0,1-.805.805H2.483a.806.806,0,0,1-.805-.805V2.483a.806.806,0,0,1,.805-.805h16.93a.806.806,0,0,1,.805.805Z"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconGradebook);
