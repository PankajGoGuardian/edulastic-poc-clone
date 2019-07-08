/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconStudentReportCard = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.723 13.747" {...props}>
    <g transform="translate(17.023 -436.001)">
      <path
        d="M61.556,10.047a.554.554,0,0,0,.393-.163l4.056-4.056,1.831,1.831a.556.556,0,0,0,.788,0L74.347,1.9V2.78a.556.556,0,1,0,1.112,0V.555h0A.556.556,0,0,0,74.919,0h-2.24a.556.556,0,1,0,0,1.112h.887L68.229,6.478,66.4,4.648a.556.556,0,0,0-.786,0L61.163,9.1a.556.556,0,0,0,.393.949Zm0,0"
        transform="translate(-73.26 437.501)"
        fill="#434b5d"
        stroke="#434b5d"
        stroke-width="1"
      />
      <g transform="translate(-17.023 436.001)">
        <path
          d="M107.3,6.723a3.108,3.108,0,0,0,2.768-3.362C110.07,1.505,109.663,0,107.3,0s-2.768,1.505-2.768,3.362A3.108,3.108,0,0,0,107.3,6.723Z"
          transform="translate(-102.075)"
          fill="#434b5d"
        />
        <path d="M41.9,300.43c0-.113,0-.032,0,0Z" transform="translate(-41.895 -288.574)" fill="#434b5d" />
        <path d="M308.085,301.589c0-.031,0-.215,0,0Z" transform="translate(-297.63 -289.644)" fill="#434b5d" />
        <path
          d="M52.357,182.479c-.051-3.234-.474-4.156-3.706-4.739a2.271,2.271,0,0,1-3.031,0c-3.2.577-3.645,1.485-3.7,4.634,0,.257-.007.271-.008.241,0,.056,0,.159,0,.34,0,0,.77,1.551,5.227,1.551s5.227-1.551,5.227-1.551c0-.116,0-.2,0-.251A2.08,2.08,0,0,1,52.357,182.479Z"
          transform="translate(-41.908 -170.759)"
          fill="#434b5d"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconStudentReportCard);
