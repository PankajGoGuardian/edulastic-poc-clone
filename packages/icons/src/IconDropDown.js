/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconDropDown = ({ title, ...props }) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20.104 20.031"
    {...props}
  >
    <g transform="translate(0 0)">
      <g fill="none" stroke="#fff" strokeWidth="1.5">
        <rect width="20.103" height="20.032" rx="5" stroke="none" />
        <rect
          x="0.75"
          y="0.75"
          width="18.603"
          height="18.532"
          rx="4.25"
          fill="none"
        />
      </g>
      <g transform="translate(6.926 9.014)">
        <path
          d="M6.425,64.056a.431.431,0,0,0-.288-.1H.409a.431.431,0,0,0-.288.1.3.3,0,0,0,0,.487l2.864,2.424a.454.454,0,0,0,.575,0l2.864-2.424a.3.3,0,0,0,0-.487Z"
          transform="translate(0 -63.953)"
          fill="#fff"
        />
      </g>
    </g>
    <title>{title || ''}</title>
  </SVG>
)

export default withIconStyles(IconDropDown)
