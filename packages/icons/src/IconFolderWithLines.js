/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconFolderWithLines = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.352"
    height="17.352"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      d="M10 3H6L5 2H2C1.45 2 1.005 2.45 1.005 3L1 9C1 9.55 1.45 10 2 10H10.385C10.725 10 11 9.72 11 9.385V4C11 3.45 10.55 3 10 3ZM10 9H2V3H4.585L5.585 4H10V9ZM9 6H3V5H9V6ZM7 8H3V7H7V8Z"
      fill="#1AB395"
    />
  </SVG>
)

export default withIconStyles(IconFolderWithLines)
