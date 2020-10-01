/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconContrast = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.93 19.93" {...props}>
    <path
      d="M2.919,2.919A9.937,9.937,0,1,0,6.086.783,9.93,9.93,0,0,0,2.919,2.919ZM9.965,18.256A8.291,8.291,0,0,1,4.1,4.1,8.237,8.237,0,0,1,9.965,1.674Z"
      transform="translate(0 0)"
    />
  </SVG>
)

export default withIconStyles(IconContrast)
