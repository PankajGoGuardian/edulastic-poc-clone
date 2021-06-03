/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconConfirmation = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="34.809"
    height="34.786"
    viewBox="0 0 34.809 34.786"
    {...props}
  >
    <g transform="translate(0 -0.168)">
      <ellipse
        cx="17.404"
        cy="17.393"
        rx="17.404"
        ry="17.393"
        transform="translate(0 0.168)"
        fill="#32bea6"
      />
      <path
        d="M122.661,152.015l-8.229-6.411,2.34-3,5.053,3.937,8.34-12.035,3.13,2.168Z"
        transform="translate(-106.652 -125.203)"
        fill="#fff"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconConfirmation)
