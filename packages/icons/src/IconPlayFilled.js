import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPlayFilled = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12.041 13.614"
    {...props}
  >
    <g transform="translate(0 0)">
      <g transform="translate(0 0)">
        <path
          d="M129.222,106.74l-9.771-5.7c-.89-.52-1.609-.1-1.6.926l.05,11.311c0,1.03.731,1.449,1.624.933l9.7-5.6A.99.99,0,0,0,129.222,106.74Z"
          transform="translate(-117.848 -100.817)"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconPlayFilled)
