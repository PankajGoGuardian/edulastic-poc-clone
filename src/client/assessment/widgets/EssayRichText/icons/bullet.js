import React from "react";
import withIconStyles from "@edulastic/icons/src/HOC/withIconStyles";
import SVG from "@edulastic/icons/src/common/SVG";

const IconBullet = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="15.061" height="13.045" viewBox="0 0 15.061 13.045" {...props}>
    <g transform="translate(0 -6.388)">
      <g transform="translate(0 6.388)">
        <circle cx="1.72" cy="1.72" r="1.72" transform="translate(0 0)" />
        <circle cx="1.72" cy="1.72" r="1.72" transform="translate(0 4.731)" />
        <circle cx="1.72" cy="1.72" r="1.72" transform="translate(0 9.606)" />
        <g transform="translate(5.088 0.595)">
          <path
            d="M32.573,12.41h9.342a.316.316,0,0,0,.315-.315v-1.62a.316.316,0,0,0-.315-.315H32.573a.316.316,0,0,0-.315.315v1.62A.315.315,0,0,0,32.573,12.41Z"
            transform="translate(-32.258 -10.159)"
          />
          <path
            d="M41.915,40.158H32.573a.316.316,0,0,0-.315.315v1.62a.316.316,0,0,0,.315.315h9.342a.316.316,0,0,0,.315-.315v-1.62A.315.315,0,0,0,41.915,40.158Z"
            transform="translate(-32.258 -35.427)"
          />
          <path
            d="M41.915,71.064H32.573a.316.316,0,0,0-.315.315V73a.316.316,0,0,0,.315.315h9.342A.316.316,0,0,0,42.231,73v-1.62A.315.315,0,0,0,41.915,71.064Z"
            transform="translate(-32.258 -61.458)"
          />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconBullet);
