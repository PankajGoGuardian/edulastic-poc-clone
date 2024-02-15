import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconSmallCircle = (props) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      {...props}
    >
      <circle cx="3" cy="3" r="3" fill="#D9D9D9" />
    </SVG>
  )
}

export default withIconStyles(IconSmallCircle)
