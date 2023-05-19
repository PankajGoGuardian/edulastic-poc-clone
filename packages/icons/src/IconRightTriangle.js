/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconRightTriangle = (props) => (
  <SVG
    width="12"
    height="19"
    viewBox="0 0 12 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.91664 8.33315C10.4383 9.04319 10.4338 10.0109 9.90566 10.7162L5.39332 16.7412C4.23794 18.2839 1.78364 17.4604 1.79252 15.5331L1.84822 3.44168C1.8571 1.51431 4.31888 0.713505 5.46 2.26678L9.91664 8.33315Z"
      stroke="#BBBBBB"
      strokeWidth="2"
    />
  </SVG>
)

export default withIconStyles(IconRightTriangle)
