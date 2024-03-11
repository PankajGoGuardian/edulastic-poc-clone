/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAssignPearDeckTutor = (props) => (
  <SVG
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    {...props}
  >
    <path
      d="M28.5273 80C28.5273 51.568 51.5753 28.528 79.9993 28.528V79.984L28.5273 80Z"
      fill="#8DD7FF"
    />
    <path
      d="M0 75.04C41.44 75.04 75.04 41.44 75.04 3.8147e-05H0.024L0 75.04Z"
      fill="#8DD7FF"
    />
    <path
      d="M29.7363 68.9121C34.0243 49.3921 49.3843 34.0321 68.9043 29.7441C61.3283 47.2721 47.2643 61.3441 29.7363 68.9121Z"
      fill="#0092E3"
    />
  </SVG>
)

export default withIconStyles(IconAssignPearDeckTutor)
