import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphTangent = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25.324 31.682"
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
        d="M3.769,0A3.769,3.769,0,1,1,0,3.769,3.769,3.769,0,0,1,3.769,0Z"
        transform="translate(5.062 8.541)"
        stroke="none"
      />
      <path
        d="M8.463,23.043s-2.834-8.1.3-11.171,12.78,3.923,15.187,1.954-.78-4.253-.78-4.253"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphTangent)
