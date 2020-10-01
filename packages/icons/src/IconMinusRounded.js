/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconMinusRounded = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" {...props}>
    <path d="M37.059,16H26H16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16h10h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z" />
  </SVG>
)

export default withIconStyles(IconMinusRounded)
