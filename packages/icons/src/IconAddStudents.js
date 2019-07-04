/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconAddStudents = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.193 11.193" {...props}>
    <path
      d="M14.779,9.649a.441.441,0,0,1-.466.466H10.349a.22.22,0,0,0-.233.233v3.964a.441.441,0,0,1-.466.466H8.716a.441.441,0,0,1-.466-.466V10.349a.22.22,0,0,0-.233-.233H4.053a.441.441,0,0,1-.466-.466V8.716a.441.441,0,0,1,.466-.466H8.017a.22.22,0,0,0,.233-.233V4.053a.441.441,0,0,1,.466-.466h.933a.441.441,0,0,1,.466.466V8.017a.22.22,0,0,0,.233.233h3.964a.441.441,0,0,1,.466.466Z"
      transform="translate(-3.587 -3.586)"
      fill="#434b5d"
    />
  </SVG>
);

export default withIconStyles(IconAddStudents);
