/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSignoutHighlight = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19.132 19.176"
    {...props}
  >
    <path
      d="M9.756,0A9.586,9.586,0,0,1,19.3,8.716H11.5V6.1a.871.871,0,0,0-1.488-.616L6.525,8.972a.871.871,0,0,0,0,1.232l3.487,3.486a.871.871,0,0,0,1.488-.616V10.46h7.8A9.586,9.586,0,1,1,9.756,0Zm0,0"
      transform="translate(-0.168)"
      fill="#fff"
    />
  </SVG>
)

export default withIconStyles(IconSignoutHighlight)
