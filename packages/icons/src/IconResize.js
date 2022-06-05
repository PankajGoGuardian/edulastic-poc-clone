/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconResize = (props) => (
  <SVG
    data-cy="icon-resize"
    xmlns="http://www.w3.org/2000/svg"
    width="9.714"
    height="9.227"
    viewBox="0 0 9.714 9.227"
    {...props}
  >
    <g transform="translate(-2794 81.214)">
      <path
        d="M0,7.523a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707L6.669-.354a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707L.354,7.376A.5.5,0,0,1,0,7.523Z"
        transform="translate(2794.5 -80.714)"
      />
      <path
        d="M0,6.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l6-6a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-6,6A.5.5,0,0,1,0,6.5Z"
        transform="translate(2796.5 -79)"
      />
      <path
        d="M0,4.714a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707L3.86-.354a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707L.354,4.567A.5.5,0,0,1,0,4.714Z"
        transform="translate(2799 -76.7)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconResize)
