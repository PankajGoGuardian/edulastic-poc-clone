/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconClass = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.6 17" {...props}>
    <g transform="translate(-51.2)">
      <path
        d="M-405.841,19200.8a6.726,6.726,0,0,1,4.592-5.609l.037.07a9.377,9.377,0,0,1,4.2-.037l.017-.033a6.953,6.953,0,0,1,4.674,5.609Z"
        transform="translate(457.124 -19183.799)"
      />
      <g transform="translate(51.2)">
        <g transform="translate(0)">
          <path
            d="M58,0,51.2,4.25l2.55,1.615a4.25,4.25,0,0,0,8.5,0L64.8,4.25Z"
            transform="translate(-51.2)"
          />
        </g>
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconClass)
