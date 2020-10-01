/* eslint-disable react/prop-types */
import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconImage = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="30px"
    height="30px"
    viewBox="0 0 18 18"
    {...props}
  >
    <rect
      height="10"
      width="12"
      x="3"
      y="4"
      stroke={props.color}
      strokeWidth="2px"
      fill="none"
    />
    <circle cx="6" cy="7" r="1" />
    <polyline points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12" />
  </SVG>
)

export default withIconStyles(IconImage)
