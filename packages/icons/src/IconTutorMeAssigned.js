/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTutorMeAssigned = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="#2F4151" />
    <path
      d="M18.4282 10.4276C14.2423 10.4276 10.8489 13.8178 10.8489 17.9999H18.4256L18.4282 10.4276Z"
      fill="#A2D3FF"
    />
    <path
      d="M17.658 6C17.658 12.4326 12.4386 17.6473 6 17.6473V6.00382L17.658 6Z"
      fill="#1FBE72"
    />
    <path
      d="M16.7018 10.6263C15.1889 10.8911 11.8862 12.54 10.9923 16.5286C12.2414 16.0682 15.1688 14.1654 16.7018 10.6263Z"
      fill="#195E44"
    />
  </SVG>
)

export default withIconStyles(IconTutorMeAssigned)
