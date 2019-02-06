/* eslint-disable react/prop-types */
import React from 'react';
import withIconStyles from './HOC/withIconStyles';
import SVG from './common/SVG';

const IconSelected = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.861 17.861" {...props}>
    <g transform="translate(0.65 0.651)">
      <path
        d="M2.588,0H1.553A1.554,1.554,0,0,0,0,1.553V2.588a.518.518,0,1,0,1.035,0V1.553a.518.518,0,0,1,.518-.518H2.588A.518.518,0,1,0,2.588,0Zm12.42,0H13.973a.518.518,0,0,0,0,1.035h1.035a.518.518,0,0,1,.518.518V2.588a.518.518,0,1,0,1.035,0V1.553A1.554,1.554,0,0,0,15.008,0Zm1.035,13.455a.517.517,0,0,0-.518.518v1.035a.518.518,0,0,1-.518.518H13.973a.518.518,0,0,0,0,1.035h1.035a1.554,1.554,0,0,0,1.553-1.553V13.973A.517.517,0,0,0,16.043,13.455ZM2.588,15.526H1.553a.518.518,0,0,1-.518-.518V13.973a.518.518,0,0,0-1.035,0v1.035a1.554,1.554,0,0,0,1.553,1.553H2.588a.518.518,0,1,0,0-1.035ZM.518,10.35a.517.517,0,0,0,.518-.518V6.728A.518.518,0,0,0,0,6.728V9.833A.517.517,0,0,0,.518,10.35ZM16.043,6.21a.517.517,0,0,0-.518.518V9.833a.518.518,0,0,0,1.035,0V6.728A.517.517,0,0,0,16.043,6.21ZM9.833,0H6.728a.518.518,0,0,0,0,1.035H9.833A.518.518,0,0,0,9.833,0Zm0,15.526H6.728a.518.518,0,0,0,0,1.035H9.833a.518.518,0,0,0,0-1.035Z"
        strokeWidth="1.3"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconSelected);
