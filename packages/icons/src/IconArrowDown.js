import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconArrowDown = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    {...props}
  >
    <g id="north">
      <path
        id="Vector"
        d="M15.8333 12.5002L14.6583 11.3252L10.8333 15.1418L10.8333 1.66683H9.16659L9.16659 15.1418L5.34159 11.3168L4.16659 12.5002L9.99992 18.3335L15.8333 12.5002Z"
        fill="black"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconArrowDown)
