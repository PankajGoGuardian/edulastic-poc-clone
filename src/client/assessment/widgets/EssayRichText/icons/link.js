import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconLink = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="23.083"
    height="14"
    viewBox="0 0 23.083 14"
    {...props}
  >
    <path d="M11,17H7A5,5,0,0,1,7,7h4V9H7a3,3,0,0,0,0,6h4ZM17,7H13V9h4a3,3,0,0,1,0,6H13v2h4A5,5,0,0,0,17,7Zm-1,4H8v2h8Z" />
  </SVG>
)

export default withIconStyles(IconLink)
