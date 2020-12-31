import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphLine = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25.594 25.594"
    {...props}
  >
    <path
      d="M15.908,0,0,15.908"
      transform="translate(9.886 1.932) rotate(30)"
      fill="none"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </SVG>
)

export default withIconStyles(IconGraphLine)
