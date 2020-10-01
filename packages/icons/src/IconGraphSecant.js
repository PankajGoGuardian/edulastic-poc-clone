import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphSecant = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24.338 25.054"
    {...props}
  >
    <g transform="translate(6.987 -2.325) rotate(30)">
      <path
        d="M14.988,0,0,14.988"
        transform="translate(4.24 2.467)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M11.81,0,0,11.81"
        transform="translate(17.672 5.877) rotate(59)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M3.769,0A3.769,3.769,0,1,1,0,3.769,3.769,3.769,0,0,1,3.769,0Z"
        transform="translate(5.062 8.541)"
        stroke="none"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphSecant)
