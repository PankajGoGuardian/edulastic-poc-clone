/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconEmptyProfile = (props) => (
  <SVG
    width="79"
    height="79"
    viewBox="0 0 79 79"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="39.115" cy="39.115" r="39.115" fill="#D1FF82" />
    <mask
      id="mask0_3249_954"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="79"
      height="79"
    >
      <circle cx="39.115" cy="39.115" r="39.115" fill="#C4C4C4" />
    </mask>
    <g mask="url(#mask0_3249_954)">
      <ellipse
        cx="39.1148"
        cy="68.8429"
        rx="29.7274"
        ry="17.2106"
        fill="#206B00"
      />
    </g>
    <circle cx="39.1148" cy="33.2479" r="14.0814" fill="#206B00" />
  </SVG>
)

export default withIconStyles(IconEmptyProfile)
