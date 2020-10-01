/* eslint-disable react/prop-types */
import React from 'react'
import { themeColor } from '@edulastic/colors'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconDownEmptyArrow = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.379 7.057" {...props}>
    <g transform="translate(12.378 -97.139) rotate(90)">
      <path
        fill={themeColor}
        d="M103.941,6.8l-5.323,5.323A.867.867,0,0,1,97.392,10.9l4.71-4.71L97.392,1.48A.867.867,0,0,1,98.618.254l5.323,5.323a.867.867,0,0,1,0,1.226Z"
        transform="translate(0 0)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconDownEmptyArrow)
