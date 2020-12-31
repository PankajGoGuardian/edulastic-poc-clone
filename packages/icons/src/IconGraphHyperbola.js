import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphHyperbola = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18.428 14.303"
    {...props}
  >
    <g transform="translate(-21.914 -0.421)">
      <path
        d="M.035,0s-.889,6.409,6.3,6.313S12.152,0,12.152,0"
        transform="translate(39.151 1.441) rotate(90)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M.035,6.315S-.854-.094,6.333,0s5.819,6.314,5.819,6.314"
        transform="translate(29.421 1.442) rotate(90)"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphHyperbola)
