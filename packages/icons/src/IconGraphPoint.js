import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphPoint = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
    <path d="M7,0A7,7,0,1,1,0,7,7,7,0,0,1,7,0Z" stroke="none" />
  </SVG>
)

export default withIconStyles(IconGraphPoint)
