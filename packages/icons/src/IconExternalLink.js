import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconExternalLink = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    {...props}
  >
    <g>
      <path
        d="M0,0V12H12V9H10.5v1.5h-9v-9H3V0ZM6,0,8.25,2.25,4.5,6,6,7.5,9.75,3.75,12,6V0Z"
        fill="#1ab395"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconExternalLink)
