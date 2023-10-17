import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconArrowUp = (props) => (
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
        d="M4.16675 7.49984L5.34175 8.67484L9.16675 4.85817V18.3332H10.8334V4.85817L14.6584 8.68317L15.8334 7.49984L10.0001 1.6665L4.16675 7.49984Z"
        fill="black"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconArrowUp)
