/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconLineReader = (props) => (
  <SVG
    data-cy="line-reader-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="20"
    viewBox="0 0 29 20"
    {...props}
  >
    <g transform="translate(-5 -9)">
      <path
        d="M1.5,1.5v5h26v-5H1.5M1,0H28a1,1,0,0,1,1,1V7a1,1,0,0,1-1,1H1A1,1,0,0,1,0,7V1A1,1,0,0,1,1,0Z"
        transform="translate(5 15)"
      />
      <path
        d="M1,0H24a1,1,0,0,1,1,1V2a1,1,0,0,1-1,1H1A1,1,0,0,1,0,2V1A1,1,0,0,1,1,0Z"
        transform="translate(7 26)"
      />
      <path
        d="M1,0H24a1,1,0,0,1,1,1V2a1,1,0,0,1-1,1H1A1,1,0,0,1,0,2V1A1,1,0,0,1,1,0Z"
        transform="translate(7 9)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconLineReader)
