import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWarnTriangle = () => (
  <SVG
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.833374 17.9167H19.1667L10 2.08337L0.833374 17.9167ZM10.8334 15.4167H9.16671V13.75H10.8334V15.4167ZM10.8334 12.0834H9.16671V8.75004H10.8334V12.0834Z"
      fill="#FFA847"
    />
  </SVG>
)

export default withIconStyles(IconWarnTriangle)
