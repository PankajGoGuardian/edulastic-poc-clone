import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCheckMark = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      id="Icon_ionic-ios-checkmark-circle"
      data-name="Icon ionic-ios-checkmark-circle"
      d="M9.375,3.375a6,6,0,1,0,6,6A6,6,0,0,0,9.375,3.375Zm3.072,4.341L8.59,11.59h0a.521.521,0,0,1-.335.159.505.505,0,0,1-.338-.164L6.3,9.969a.115.115,0,0,1,0-.164l.513-.513a.112.112,0,0,1,.162,0l1.281,1.281,3.519-3.545a.114.114,0,0,1,.081-.035h0a.1.1,0,0,1,.081.035l.5.522A.114.114,0,0,1,12.447,7.716Z"
      transform="translate(-3.375 -3.375)"
    />
  </SVG>
)

export default withIconStyles(IconCheckMark)
