/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPurchasedAlert = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.54"
    height="17.54"
    viewBox="0 0 17.54 17.54"
    {...props}
  >
    <path
      d="M14.971,14.971a8.769,8.769,0,1,0-12.4,0A8.768,8.768,0,0,0,14.971,14.971ZM5.626,7.43,7.6,9.4l4.32-4.317,1.528,1.528L9.13,10.93,7.6,12.458,6.069,10.93,4.1,8.958Z"
      fill="#0ba4e0"
    />
  </SVG>
)

export default withIconStyles(IconPurchasedAlert)
