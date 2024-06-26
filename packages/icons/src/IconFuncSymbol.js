/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFuncSymbol = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.342 20.584" {...props}>
    <g transform="translate(-11.224)">
      <g transform="translate(11.224)">
        <path
          d="M14.567,20.584a3.153,3.153,0,0,0,2.837-2.39q.006-.021.012-.043C18.028,15.618,19,11.6,19.724,8.68h2.583a.88.88,0,0,0,0-1.759H20.162c.231-.92.4-1.576.467-1.8l.074-.25c.273-.931.911-3.11,1.9-3.11.916,0,1.052,1.41,1.058,1.478A.88.88,0,0,0,25.413,3.1C25.331,2.027,24.637,0,22.6,0,20.3,0,19.43,2.955,19.014,4.375l-.071.24c-.084.281-.306,1.147-.6,2.306H15.27a.88.88,0,1,0,0,1.759h2.642c-.9,3.663-2.07,8.5-2.2,9.027-.048.139-.409,1.118-1.146,1.118-1.127,0-1.614-1.581-1.618-1.593a.88.88,0,1,0-1.69.49C11.567,18.784,12.609,20.584,14.567,20.584Z"
          transform="translate(-11.224)"
        />
        <path
          d="M90.447,82.234a.923.923,0,0,0,.954-.954,1.194,1.194,0,0,0-.341-.791l-1.827-2.1,1.772-2.072a1.1,1.1,0,0,0,.286-.709.916.916,0,0,0-.968-.9,1.194,1.194,0,0,0-.9.532l-1.377,1.8-1.349-1.8a1.184,1.184,0,0,0-.968-.532.924.924,0,0,0-.954.955,1.2,1.2,0,0,0,.34.79l1.7,1.963-1.868,2.208a1.036,1.036,0,0,0-.286.709.916.916,0,0,0,.968.9,1.194,1.194,0,0,0,.9-.532l1.472-1.935L89.478,81.7A1.185,1.185,0,0,0,90.447,82.234Z"
          transform="translate(-74.059 -63.918)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconFuncSymbol);
