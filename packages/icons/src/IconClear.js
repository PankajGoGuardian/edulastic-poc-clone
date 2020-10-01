/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconClear = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="16.86"
    height="20.022"
    viewBox="0 0 16.86 20.022"
    {...props}
  >
    <g transform="translate(0 0)">
      <path
        className="a"
        d="M2.748,11.6,11.41.536A1.406,1.406,0,0,1,13.381.3l5.389,4.218a1.405,1.405,0,0,1,.241,1.973L10.427,17.43l-2.5,0L2.989,13.571A1.406,1.406,0,0,1,2.748,11.6Zm10.56.086,4.821-6.158L12.349,1,7.526,7.159Z"
        transform="translate(-2.45 0)"
      />
      <rect
        className="a"
        width="13.33"
        height="2.167"
        transform="translate(2.568 17.855)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconClear)
