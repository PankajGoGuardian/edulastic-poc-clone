/* eslint-disable react/prop-types */
import React from 'react'
import { themeColor } from '@edulastic/colors'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTriangle = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18.807 18.024"
    {...props}
  >
    <g transform="translate(0 0)">
      <g transform="translate(1.614 1.719)" fill="#fff">
        <path
          d="M 12.91672039031982 14.33094024658203 L 1.000000596046448 14.33094024658203 L 1.000000596046448 2.414220571517944 L 12.91672039031982 14.33094024658203 Z"
          stroke="none"
          fill="none"
        />
        <path
          d="M 2.000000953674316 4.828420639038086 L 2.000000953674316 13.33094024658203 L 10.50252056121826 13.33094024658203 L 2.000000953674316 4.828420639038086 M 9.5367431640625e-07 9.5367431640625e-07 L 15.33094024658203 15.33094024658203 L 9.5367431640625e-07 15.33094024658203 L 9.5367431640625e-07 9.5367431640625e-07 Z"
          stroke="none"
          fill={props.color || themeColor}
        />
      </g>
      <g transform="translate(0 0)">
        <circle cx="2.351" cy="2.351" r="2.351" transform="translate(0 0)" />
        <circle
          cx="2.351"
          cy="2.351"
          r="2.351"
          transform="translate(0 13.322)"
        />
        <circle
          cx="2.351"
          cy="2.351"
          r="2.351"
          transform="translate(14.106 13.322)"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconTriangle)
