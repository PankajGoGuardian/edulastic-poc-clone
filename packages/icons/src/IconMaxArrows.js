/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconMaxArrows = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <g transform="translate(-1272.339 -103.335)">
      <g transform="translate(1272.339 103.335)" fill="none" strokeWidth="1">
        <circle cx="16" cy="16" r="16" stroke="none" />
        <circle cx="16" cy="16" r="15.5" fill="none" />
      </g>
      <path
        d="M0,0H4.675L2.168,2.549,0,4.675Z"
        transform="translate(1288.576 106.359) rotate(45)"
      />
      <path
        d="M0,0H4.68L2.17,2.551,0,4.68Z"
        transform="translate(1300.814 119.144) rotate(135)"
      />
      <line
        y2="22"
        transform="translate(1288.539 107.835)"
        fill="none"
        strokeWidth="1.5"
      />
      <line
        y2="22"
        transform="translate(1299.539 119.035) rotate(90)"
        fill="none"
        strokeWidth="1.5"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconMaxArrows)
