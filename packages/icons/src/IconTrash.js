/* eslint-disable react/prop-types */
import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTrash = ({ title, ...props }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11.729 15.702"
    {...props}
  >
    <title lang="en">Delete Icon</title>
    <desc>Delete Icon</desc>
    <g transform="translate(0)">
      <path
        d="M48.889.522V0H45.4V.522h-4.12V2.634H53.01V.522Z"
        transform="translate(-41.282)"
      />
      <path
        d="M57.546,80.756h8.939l.642-12.412H56.9Zm5.486-9.511h1.107V77.57H63.032Zm-3.14,0H61V77.57H59.892Z"
        transform="translate(-56.152 -65.054)"
      />
    </g>
    <title>{title || ''}</title>
  </SVG>
)

export default withIconStyles(IconTrash)
