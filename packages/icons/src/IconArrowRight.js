import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconArrowRight = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.135"
    height="11.792"
    viewBox="0 0 17.135 11.792"
    {...props}
  >
    <g transform="translate(0 0)">
      <path
        d="M16.9,47.249l-5.1-5.1a.8.8,0,1,0-1.127,1.127l3.739,3.739H.8a.8.8,0,1,0,0,1.593H14.415l-3.739,3.739A.8.8,0,0,0,11.8,53.474l5.1-5.1A.8.8,0,0,0,16.9,47.249Z"
        transform="translate(0 -41.916)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconArrowRight)
