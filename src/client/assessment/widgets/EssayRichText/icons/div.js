import React from "react";
import withIconStyles from "@edulastic/icons/src/HOC/withIconStyles";
import SVG from "@edulastic/icons/src/common/SVG";

const IconDiv = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="22.12" height="13.5" viewBox="0 0 22.12 13.5" {...props}>
    <g transform="translate(-8.275 -27)">
      <path
        d="M7.5-4a3.867,3.867,0,0,1-1.1,2.97A4.5,4.5,0,0,1,3.212,0H.988V-7.853H3.454A4.152,4.152,0,0,1,6.44-6.837,3.734,3.734,0,0,1,7.5-4Zm-1.729.043q0-2.53-2.234-2.53H2.653v5.113h.714Q5.774-1.375,5.774-3.958ZM8.581,0V-7.853h1.665V0Zm7.571-7.853h1.681L15.164,0H13.348L10.684-7.853h1.681L13.842-3.18q.124.414.255.964t.164.765a13.758,13.758,0,0,1,.4-1.729Z"
        transform="translate(12.563 38)"
      />
      <g transform="translate(9.775 27) rotate(90)" strokeWidth="1">
        <rect width="13.5" height="1.5" rx="0.75" stroke="none" />
        <rect x="0.5" y="0.5" width="12.5" height="0.5" rx="0.25" fill="none" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconDiv);
