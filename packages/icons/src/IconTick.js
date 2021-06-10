/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTick = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="16.221"
    height="16.221"
    viewBox="0 0 16.221 16.221"
    {...props}
  >
    <path d="M4.785,6.57,3.65,7.705l3.65,3.65L15.41,3.244,14.275,2.109,7.3,9.084ZM14.6,8.111A6.488,6.488,0,1,1,8.111,1.622a6.325,6.325,0,0,1,1.784.243l1.3-1.3A9.872,9.872,0,0,0,8.111,0a8.111,8.111,0,1,0,8.111,8.111Z" />
  </SVG>
)

export default withIconStyles(IconTick)
