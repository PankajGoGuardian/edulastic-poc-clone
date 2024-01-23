import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconVQVideoBG = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_5073_1488)" />
    <defs>
      <linearGradient
        id="paint0_linear_5073_1488"
        x1="19.4"
        y1="1.96696e-08"
        x2="18.6502"
        y2="39.9882"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E36C0D" />
        <stop offset="1" stopColor="#F5CB9A" />
      </linearGradient>
    </defs>
  </SVG>
)

export default withIconStyles(IconVQVideoBG)
