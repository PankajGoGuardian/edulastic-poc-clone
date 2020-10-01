import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSelectCaretDown = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.379 7.056" {...props}>
    <g transform="translate(12.379) rotate(90)">
      <path
        className="a"
        d="M6.8,6.8,1.48,12.125A.867.867,0,0,1,.254,10.9l4.71-4.71L.254,1.48A.867.867,0,0,1,1.48.254L6.8,5.577A.867.867,0,0,1,6.8,6.8Z"
        transform="translate(0 0)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconSelectCaretDown)
