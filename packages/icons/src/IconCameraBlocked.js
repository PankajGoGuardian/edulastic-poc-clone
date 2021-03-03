/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCameraBlocked = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18" {...props}>
    <defs>
      <path
        d="M21.75 12V1.5H1.5v21h20.25v-.438a1.991 1.991 0 0 1-1.25.438H12V14a2 2 0 0 1 2-2h7.75z"
        id="a"
      />
    </defs>
    <g transform="translate(-3 -6)">
      <path
        d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
        fill="#E0E0E0"
        mask="url(#b)"
      />
      <g transform="translate(13.5 13.5)">
        <rect fill="#DB4437" width="10.5" height="10.5" rx="2" />
        <path
          d="M5.25 6.04L3.204 8.086a.559.559 0 0 1-.79-.79L4.46 5.25 2.414 3.204a.559.559 0 0 1 .79-.79L5.25 4.46l2.046-2.046a.559.559 0 0 1 .79.79L6.04 5.25l2.046 2.046a.559.559 0 0 1-.79.79L5.25 6.04z"
          fill="#FFF"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconCameraBlocked)
