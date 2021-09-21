/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconReferenceSheet = (props) => (
  <SVG
    data-cy="icon-reference-sheet"
    xmlns="http://www.w3.org/2000/svg"
    width="20.173"
    height="22.294"
    viewBox="0 0 20.173 22.294"
    {...props}
  >
    <g transform="translate(-24.357)">
      <path d="M33.683.353,33.31,0,24.357,5.811l.572.572c.221.221,5.464,5.416,9.606,5.416h.2l9.8-6.531H42.373c-3.608,0-8.639-4.867-8.69-4.915Z" />
      <path
        d="M39.916,340.363l-4.788,3.192h-.593c-2.773,0-5.81-1.892-7.918-3.526l-2.26,1.456.572.572c.221.221,5.464,5.46,9.606,5.46h.2l9.8-6.575H42.373A6.591,6.591,0,0,1,39.916,340.363Z"
        transform="translate(0 -325.223)"
      />
      <path
        d="M39.916,220.363l-4.788,3.192h-.593c-2.773,0-5.81-1.892-7.918-3.526l-2.26,1.456.572.572c.221.221,5.464,5.416,9.606,5.416h.2l9.8-6.531H42.373A6.591,6.591,0,0,1,39.916,220.363Z"
        transform="translate(0 -210.448)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconReferenceSheet)
