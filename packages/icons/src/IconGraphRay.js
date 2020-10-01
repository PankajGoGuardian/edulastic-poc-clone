import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphRay = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 29.737 24.338"
    {...props}
  >
    <g transform="translate(0 1.932)">
      <path
        d="M14.988,0,0,14.988"
        transform="translate(13.094 0) rotate(30)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M3.769,0A3.769,3.769,0,1,1,0,3.769,3.769,3.769,0,0,1,3.769,0Z"
        transform="translate(3.769 7.672) rotate(30)"
      />
      <path
        d="M0,0H5.809L2.693,3.167,0,5.809Z"
        transform="translate(29.737 6.76) rotate(120)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphRay)
