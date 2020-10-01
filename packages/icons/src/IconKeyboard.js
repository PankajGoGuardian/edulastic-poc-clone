/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconKeyboard = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30.867 21.607"
    {...props}
  >
    <g transform="translate(0 0.001)">
      <g transform="translate(0 0)">
        <path
          d="M27.781,76.5H3.087A3.1,3.1,0,0,0,0,79.587V95.02a3.1,3.1,0,0,0,3.087,3.087H27.781a3.1,3.1,0,0,0,3.087-3.087V79.587A3.1,3.1,0,0,0,27.781,76.5ZM13.89,81.13h3.087v3.087H13.89Zm0,4.63h3.087v3.087H13.89ZM9.26,81.13h3.087v3.087H9.26Zm0,4.63h3.087v3.087H9.26ZM7.717,88.847H4.63V85.76H7.717Zm0-4.63H4.63V81.13H7.717Zm13.89,10.8H9.26V91.934H21.607Zm0-6.173H18.52V85.76h3.087Zm0-4.63H18.52V81.13h3.087Zm4.63,4.63H23.151V85.76h3.087Zm0-4.63H23.151V81.13h3.087Z"
          transform="translate(0 -76.5)"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconKeyboard)
