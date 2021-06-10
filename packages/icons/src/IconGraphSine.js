import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphSine = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="25.697"
    height="25.698"
    viewBox="0 0 25.697 25.698"
    {...props}
  >
    <g transform="translate(-417.879 -468.504)">
      <path
        d="M442.576,482.353h-23.7a1,1,0,0,1,0-2h23.7a1,1,0,0,1,0,2Z"
        fill="#c1c3c9"
      />
      <path
        d="M430.728,494.2a1,1,0,0,1-1-1V469.5a1,1,0,0,1,2,0v23.7A1,1,0,0,1,430.728,494.2Z"
        fill="#c1c3c9"
      />
      <path d="M418.977,489.407a.75.75,0,0,1-.022-1.5c.108,0,10.793-.394,11.025-6.315.363-9.273,11.835-10,11.952-10a.75.75,0,0,1,.081,1.5c-.417.023-10.225.66-10.534,8.564-.287,7.316-11.982,7.743-12.479,7.757Z" />
    </g>
  </SVG>
)

export default withIconStyles(IconGraphSine)
