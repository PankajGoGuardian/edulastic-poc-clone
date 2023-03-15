import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWhiteStop = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    {...props}
  >
    <rect
      id="Rectangle_3773"
      data-name="Rectangle 3773"
      width="15"
      height="15"
      rx="1"
      fill="#fff"
    />
  </SVG>
)

export default withIconStyles(IconWhiteStop)
