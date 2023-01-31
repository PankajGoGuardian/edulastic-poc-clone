import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWhiteStop = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    {...props}
  >
    <rect
      id="Rectangle_3773"
      data-name="Rectangle 3773"
      width="8"
      height="8"
      rx="1"
      fill="#fff"
    />
  </SVG>
)

export default withIconStyles(IconWhiteStop)
