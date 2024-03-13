import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconDefaultTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle opacity="0.15" cx="21" cy="21" r="21" fill="#F4B955" />
    <path
      d="M24.9975 10.2742L30.6035 15.8802L21.581 24.9027L21.5766 24.9021L16.735 29.7255L11.4075 29.7252V29.4762H11.4015L11.3965 23.8752L24.9975 10.2742Z"
      fill="url(#paint0_linear_61_2372)"
    />
    <path
      opacity="0.6"
      d="M16.7349 29.7251L29.9683 29.7258V28.2258H18.2573L16.7349 29.7251Z"
      fill="black"
    />
    <defs>
      <linearGradient
        id="paint0_linear_61_2372"
        x1="21"
        y1="10.2742"
        x2="21"
        y2="29.7255"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F4B955" />
        <stop offset="1" stopColor="#EDD4A9" stopOpacity="0.7" />
      </linearGradient>
    </defs>
  </SVG>
)

export default withIconStyles(IconDefaultTest)
