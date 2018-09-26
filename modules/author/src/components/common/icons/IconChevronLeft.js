/* eslint-disable react/prop-types */
import React from 'react';

import withIconStyles from '../HOC/withIconStyles';
import SVG from './common/SVG';

const IconChevronLeft = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.282 15.799" {...props}>
    <g id="close-menu-arrow" transform="rotate(180 55.38 7.9)">
      <g id="Group_2" data-name="Group 2" transform="translate(101.478)">
        <path
          id="Path_8"
          d="M110.508 7.283L103.477.252a.866.866 0 0 0-1.222 0l-.518.518a.865.865 0 0 0 0 1.222l5.9 5.9-5.91 5.91a.866.866 0 0 0 0 1.222l.518.517a.866.866 0 0 0 1.222 0l7.037-7.037a.872.872 0 0 0 0-1.226z"
          className="cls-1"
          data-name="Path 8"
          transform="translate(-101.478)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconChevronLeft);
