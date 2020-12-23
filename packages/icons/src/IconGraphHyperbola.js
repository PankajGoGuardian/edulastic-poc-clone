import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphHyperbola = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="40.752"
    height="25.698"
    viewBox="0 0 40.752 25.698"
    {...props}
  >
    <g transform="translate(-338.022 -407.575)">
      <path
        d="M370.179,421.423h-23.7a1,1,0,0,1,0-2h23.7a1,1,0,0,1,0,2Z"
        fill="#c1c3c9"
      />
      <path
        d="M358.33,433.273a1,1,0,0,1-1-1v-23.7a1,1,0,1,1,2,0v23.7A1,1,0,0,1,358.33,433.273Z"
        fill="#c1c3c9"
      />
      <path d="M339.023,429.941a1,1,0,0,1-.134-1.991c3.84-.527,13.821-3,13.886-8.009.066-5.035-10.036-8.009-13.935-8.73a1,1,0,0,1,.365-1.967c.639.118,15.671,2.988,15.57,10.723-.1,7.754-14.982,9.879-15.615,9.966A1.28,1.28,0,0,1,339.023,429.941Z" />
      <path d="M377.776,429.941a1.265,1.265,0,0,1-.137-.008c-.634-.087-15.514-2.215-15.617-9.966-.1-7.734,14.931-10.606,15.57-10.724a1,1,0,0,1,.365,1.967c-3.9.724-14,3.7-13.935,8.731.066,5.011,10.048,7.481,13.889,8.01a1,1,0,0,1-.135,1.99Z" />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphHyperbola)
