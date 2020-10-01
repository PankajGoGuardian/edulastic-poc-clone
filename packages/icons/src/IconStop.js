import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconStop = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" {...props}>
    <rect width="15" height="15" rx="2" transform="translate(0 0)" />
  </SVG>
)

export default withIconStyles(IconStop)
