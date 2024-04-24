/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAddToFolder = (props) => (
  <SVG
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.66683 2.66675H2.66683C1.9335 2.66675 1.34016 3.26675 1.34016 4.00008L1.3335 12.0001C1.3335 12.7334 1.9335 13.3334 2.66683 13.3334H13.3335C14.0668 13.3334 14.6668 12.7334 14.6668 12.0001V5.33341C14.6668 4.60008 14.0668 4.00008 13.3335 4.00008H8.00016L6.66683 2.66675Z"
      fill="#1AB395"
    />
    <circle cx="13" cy="12" r="4.5" fill="#1AB395" stroke="white" />
    <path
      d="M14.7998 12.3H13.2998V13.8H12.7998V12.3H11.2998V11.8H12.7998V10.3H13.2998V11.8H14.7998V12.3Z"
      fill="white"
      stroke="white"
      strokeWidth="0.5"
    />
  </SVG>
)

export default withIconStyles(IconAddToFolder)
