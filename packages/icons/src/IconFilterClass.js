import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconFilterClass = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17.448 11.632"
    {...props}
  >
    <path
      d="M6.785,88.132h3.877V86.193H6.785ZM0,76.5v1.939H17.448V76.5Zm2.908,6.785H14.54V81.347H2.908Z"
      transform="translate(0 -76.5)"
    />
  </SVG>
)

export default withIconStyles(IconFilterClass)
