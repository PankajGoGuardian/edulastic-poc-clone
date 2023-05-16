import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWhitePause = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="8.266"
    height="9.644"
    viewBox="0 0 8.266 9.644"
    {...props}
  >
    <path
      id="pause_FILL0_wght400_GRAD0_opsz48"
      d="M17.6,19.644V10h2.669v9.644Zm-5.6,0V10h2.669v9.644Z"
      transform="translate(-12 -10)"
      fill="#fff"
    />
  </SVG>
)

export default withIconStyles(IconWhitePause)
