import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconStar = () => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="19"
      viewBox="0 0 27 19"
    >
      <g transform="translate(-246 -251.999)">
        <g transform="translate(242.34 251.73)">
          <rect
            width="27"
            height="19"
            rx="2"
            transform="translate(3.66 0.269)"
            fill="#feb63a"
          />
          <text
            transform="translate(13.66 13.269)"
            fill="#fff"
            fontSize="8"
            fontFamily="SegoeUISymbol, Segoe UI Symbol"
            letterSpacing="0.019em"
            opacity="0"
          >
            <tspan x="0" y="0">
              ★
            </tspan>
          </text>
        </g>
        <path
          d="M3.577-4.8l1-2.906L5.586-4.8h3.04L6.209-2.89,7.149,0,4.576-1.713,2.014,0l.94-2.89L.537-4.8Z"
          transform="translate(254.861 265.402)"
          fill="#fff"
        />
      </g>
    </SVG>
  )
}

export default withIconStyles(IconStar)
