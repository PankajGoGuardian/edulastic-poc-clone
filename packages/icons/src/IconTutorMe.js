import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTutorMe = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 512 512"
    fill="none"
    {...props}
  >
    <path
      fill="#8DD7FF"
      d="M182.6 512c0-182 147.5-329.4 329.4-329.4v329.3l-329.4.1Z"
    />
    <path
      fill="#8DD7FF"
      d="M0 480.3c265.2 0 480.3-215 480.3-480.3H.2L0 480.3Z"
    />
    <path
      fill="#0092E3"
      d="M190.3 441A329.7 329.7 0 0 1 441 190.4 481.8 481.8 0 0 1 190.3 441Z"
    />
  </SVG>
)

export default withIconStyles(IconTutorMe)
