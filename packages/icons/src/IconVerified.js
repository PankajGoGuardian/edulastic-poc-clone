/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconVerified = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="21.135"
    height="21.135"
    viewBox="0 0 21.135 21.135"
    {...props}
  >
    <g transform="translate(0.25 0.25)">
      <path d="M17.613,3.022A10.317,10.317,0,0,0,3.022,17.613,10.317,10.317,0,1,0,17.613,3.022Zm-7.3,16.4a9.108,9.108,0,1,1,9.108-9.108A9.119,9.119,0,0,1,10.317,19.426Z" />
      <path
        d="M139.336,169.644a.6.6,0,0,0-.855,0l-5.338,5.338-2.81-2.81a.6.6,0,0,0-.855.855l3.238,3.238a.6.6,0,0,0,.855,0l5.766-5.766A.6.6,0,0,0,139.336,169.644Z"
        transform="translate(-124.089 -162.637)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconVerified)
