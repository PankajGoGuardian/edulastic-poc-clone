/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTrueFalse = ({ title, ...props }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21.683 17.061"
    {...props}
  >
    <path
      d="M9.131,4.031l-3.84,3.5L3.626,5.866,2.063,7.43,4.475,9.809l.748.748L6,9.843l4.588-4.214ZM12.87,7.26V9.435H23.745V7.26ZM3.864,13,2.3,14.567l2.481,2.481L2.3,19.529l1.563,1.563,2.481-2.481,2.481,2.481,1.563-1.563L7.908,17.048l2.481-2.481L8.826,13,6.345,15.484ZM12.87,15.96v2.175H23.745V15.96Z"
      transform="translate(-2.063 -4.031)"
      fill="#fff"
    />
    <title>{title || ''}</title>
  </SVG>
)

export default withIconStyles(IconTrueFalse)
