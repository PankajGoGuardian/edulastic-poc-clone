import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphExponent = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="40.501"
    height="23.94"
    viewBox="0 0 40.501 23.94"
    {...props}
  >
    <g transform="translate(-260.188 -469.834)">
      <path
        d="M261.2,493.5a1,1,0,0,1-.008-2l38.486-.3h.008a1,1,0,0,1,.008,2l-38.486.3Z"
        fill="#c1c3c9"
      />
      <path
        d="M280.446,493.2a1,1,0,0,1-1-1V470.834a1,1,0,0,1,2,0V492.2A1,1,0,0,1,280.446,493.2Z"
        fill="#c1c3c9"
      />
      <path d="M261.187,493.774a1,1,0,0,1-.036-2c33.766-1.262,35.853-20.454,35.87-20.647a1,1,0,0,1,1.992.176c-.076.863-2.277,21.142-37.788,22.469Z" />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphExponent)
