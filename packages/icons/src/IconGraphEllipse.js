import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphEllipse = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10" {...props}>
    <path
      d="M7,0c3.866,0,7,2.239,7,5s-3.134,5-7,5S0,7.761,0,5,3.134,0,7,0Z"
      stroke="none"
    />
  </SVG>
)

export default withIconStyles(IconGraphEllipse)
