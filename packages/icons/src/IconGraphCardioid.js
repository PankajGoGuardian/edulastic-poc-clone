import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphCardioid = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="34.332"
    height="26.752"
    viewBox="0 0 34.332 26.752"
    {...props}
  >
    <g transform="translate(-13.755 4.348)">
      <path
        d="M0,17.757a1,1,0,0,1-.707-.293,1,1,0,0,1,0-1.414L16.05-.707a1,1,0,0,1,1.414,0,1,1,0,0,1,0,1.414L.707,17.464A1,1,0,0,1,0,17.757Z"
        transform="translate(27.019 -2.934) rotate(45)"
      />
      <path
        d="M0,17.757a1,1,0,0,1-.707-.293,1,1,0,0,1,0-1.414L16.05-.707a1,1,0,0,1,1.414,0,1,1,0,0,1,0,1.414L.707,17.464A1,1,0,0,1,0,17.757Z"
        transform="translate(15.169 8.915) rotate(-45)"
      />
      <path
        d="M13,2A8.618,8.618,0,0,0,5.507,5.867,5.87,5.87,0,0,0,5.732,12l.625,1.082-.7,1.036a5.145,5.145,0,0,0-.292,5.565,8.041,8.041,0,0,0,3.024,3.059A9.1,9.1,0,0,0,13,24,11,11,0,0,0,20.778,5.222,10.928,10.928,0,0,0,13,2m0-2a13,13,0,0,1,0,26C5.82,26-.011,18.953,4,13,.137,6.308,5.82,0,13,0Z"
        transform="translate(22.087 -3.597)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphCardioid)
