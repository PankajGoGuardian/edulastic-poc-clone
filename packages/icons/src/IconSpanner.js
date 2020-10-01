/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconSpanner = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
    <path
      d="M17.711,3.809,14.747,6.773l-2.593-.926-.926-2.593L14.192.29A5.585,5.585,0,0,0,7.086,7.253a2.626,2.626,0,0,0-.233.206L.765,13.547a2.609,2.609,0,0,0,3.69,3.69l6.088-6.088a2.635,2.635,0,0,0,.206-.233,5.585,5.585,0,0,0,6.963-7.106Z"
      transform="translate(-0.001 0)"
    />
  </SVG>
)

export default withIconStyles(IconSpanner)
