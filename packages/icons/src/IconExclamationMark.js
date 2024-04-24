/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconExclamationMark = ({
  backgroundColor = '#de0b83',
  foregroundColor = '#fff',
  ...rest
}) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.527 12.527" {...rest}>
    <g transform="translate(0.001 0)">
      <path
        fill={backgroundColor}
        d="M0,6.263a6.264,6.264,0,1,1,6.263,6.264A6.282,6.282,0,0,1,0,6.263Z"
      />
      <path
        fill={foregroundColor}
        d="M2.315-4.142H1.032L.764-9.28h1.82ZM.743-2.343a.882.882,0,0,1,.237-.668.96.96,0,0,1,.689-.226.932.932,0,0,1,.676.231.879.879,0,0,1,.239.663.879.879,0,0,1-.242.655.916.916,0,0,1-.673.239.943.943,0,0,1-.684-.234A.876.876,0,0,1,.743-2.343Z"
        transform="translate(4.647 11.764)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconExclamationMark)
