/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAlertCircle = ({ fill, ...restProps }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="17.54"
    height="17.54"
    viewBox="0 0 17.54 17.54"
    {...restProps}
  >
    <g transform="translate(-289 -30)">
      <g transform="translate(289 30)">
        <path
          d="M8.77,0a8.77,8.77,0,1,0,8.77,8.77A8.773,8.773,0,0,0,8.77,0Zm.877,13.155H7.893V11.4H9.647v1.754Zm0-3.508H7.893V4.385H9.647V9.647Z"
          fill={fill || '#e5923f'}
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconAlertCircle)
