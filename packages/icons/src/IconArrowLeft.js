import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconArrowLeft = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.135"
    height="11.792"
    viewBox="0 0 17.135 11.792"
    {...props}
  >
    <g transform="translate(0 0)">
      <path
        d="M.233,47.249l5.1-5.1a.8.8,0,0,1,1.127,1.127L2.72,47.015H16.338a.8.8,0,1,1,0,1.593H2.72l3.739,3.739a.8.8,0,0,1-1.127,1.127l-5.1-5.1A.8.8,0,0,1,.233,47.249Z"
        transform="translate(0 -41.916)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconArrowLeft)
