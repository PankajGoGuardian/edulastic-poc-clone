import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPlayButton = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="15.848"
    height="15.848"
    viewBox="0 0 15.848 15.848"
    {...props}
  >
    <path
      d="M7.924,0a7.924,7.924,0,1,0,7.924,7.924A7.924,7.924,0,0,0,7.924,0Zm3.337,8.176a.566.566,0,0,1-.254.254v0L6.479,10.7a.566.566,0,0,1-.819-.509V5.66a.566.566,0,0,1,.819-.507l4.528,2.264A.566.566,0,0,1,11.261,8.176Z"
      fill="#1ab395"
    />
  </SVG>
)

export default withIconStyles(IconPlayButton)
