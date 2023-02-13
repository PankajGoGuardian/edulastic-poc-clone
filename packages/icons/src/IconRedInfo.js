import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconRedInfo = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="16.609"
    height="16.609"
    viewBox="0 0 16.609 16.609"
    {...props}
  >
    <path
      id="Icon_material-error-outline"
      data-name="Icon material-error-outline"
      d="M10.474,13.8h1.661v1.661H10.474Zm0-6.644h1.661v4.983H10.474ZM11.3,3a8.3,8.3,0,1,0,8.313,8.3A8.3,8.3,0,0,0,11.3,3ZM11.3,17.948A6.644,6.644,0,1,1,17.948,11.3,6.642,6.642,0,0,1,11.3,17.948Z"
      transform="translate(-3 -3)"
      fill="#eb4032"
    />
  </SVG>
)

export default withIconStyles(IconRedInfo)
