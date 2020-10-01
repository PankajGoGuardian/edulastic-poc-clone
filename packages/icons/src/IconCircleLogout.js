/* eslint-disable react/prop-types */
import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCircleLogout = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.935 19.98" {...props}>
    <path
      d="M10.158,0A9.988,9.988,0,0,1,20.1,9.082H11.974V6.357a.908.908,0,0,0-1.55-.642L6.791,9.348a.907.907,0,0,0,0,1.284l3.633,3.633a.908.908,0,0,0,1.55-.642V10.9H20.1A9.988,9.988,0,1,1,10.158,0Zm0,0"
      transform="translate(-0.168)"
    />
  </SVG>
)

export default withIconStyles(IconCircleLogout)
