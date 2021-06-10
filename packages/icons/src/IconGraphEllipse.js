import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphEllipse = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="31"
    height="20.1"
    viewBox="0 0 31 20.1"
    {...props}
  >
    <g transform="translate(-327.114 -353.449)">
      <path
        d="M342.614,355.449c7.456,0,13.5,3.6,13.5,8.05s-6.044,8.05-13.5,8.05-13.5-3.6-13.5-8.05S335.158,355.449,342.614,355.449Z"
        fill="none"
      />
      <path d="M342.614,355.449c-7.456,0-13.5,3.6-13.5,8.05s6.044,8.05,13.5,8.05,13.5-3.605,13.5-8.05-6.044-8.05-13.5-8.05m0-2a20.923,20.923,0,0,1,10.57,2.64,11.323,11.323,0,0,1,3.5,3.119,7.151,7.151,0,0,1,0,8.581,11.338,11.338,0,0,1-3.5,3.12,22.48,22.48,0,0,1-21.14,0,11.342,11.342,0,0,1-3.5-3.12,7.156,7.156,0,0,1,0-8.581,11.328,11.328,0,0,1,3.5-3.119A20.92,20.92,0,0,1,342.614,353.449Z" />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphEllipse)
