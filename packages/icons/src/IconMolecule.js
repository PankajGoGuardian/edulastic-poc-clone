/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconMore = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25.614 25.601"
    {...props}
  >
    <g transform="translate(0.257 0.25)">
      <path
        className="a"
        d="M13.534,134.025,10.4,128.273A.522.522,0,0,0,9.938,128H3.663a.522.522,0,0,0-.459.273L.067,134.025a.519.519,0,0,0,0,.5L3.2,140.277a.522.522,0,0,0,.459.273H9.938a.522.522,0,0,0,.459-.273l3.138-5.752A.519.519,0,0,0,13.534,134.025ZM9.628,139.5H3.973l-2.853-5.229,2.853-5.229H9.628l2.853,5.229Z"
        transform="translate(-0.003 -121.725)"
      />
      <path
        className="a"
        d="M237.88,11.764a.525.525,0,0,0,.455.264h6.275a.524.524,0,0,0,.454-.264L248.2,6.273a.528.528,0,0,0,0-.519L245.064.264A.524.524,0,0,0,244.61,0h-6.275a.525.525,0,0,0-.455.264l-3.138,5.491a.528.528,0,0,0,0,.519Zm.758-10.718h5.668l2.838,4.968-2.838,4.968h-5.668L235.8,6.014Z"
        transform="translate(-223.17)"
      />
      <path
        className="a"
        d="M245.064,266.93a.524.524,0,0,0-.454-.263h-6.275a.525.525,0,0,0-.455.263l-3.138,5.491a.528.528,0,0,0,0,.519l3.138,5.491a.525.525,0,0,0,.455.264h6.275a.525.525,0,0,0,.454-.264l3.138-5.491a.528.528,0,0,0,0-.519Zm-.758,10.718h-5.668l-2.838-4.968,2.838-4.968h5.668l2.838,4.968Z"
        transform="translate(-223.17 -253.594)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconMore)
