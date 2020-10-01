import { themeColor } from '@edulastic/colors'
import React from 'react'
import SVG from './common/SVG'
import withIconStyles from './HOC/withIconStyles'

const IconELogo = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.49 21.673" {...props}>
    <g transform="translate(24379.039 -2253)">
      <path
        d="M7.317,20.59l-.014.018c-.177-.162-.393-.353-.626-.552l.015-.019L6.548,19.9A8.481,8.481,0,0,0,5.16,18.779c-.133-.069-.269-.135-.4-.2l-.045-.024a5.355,5.355,0,0,0-.565-.226c-.134-.049-.272-.1-.408-.139-.558-.184-1.157-.361-1.388-.429l.019-.024A3.671,3.671,0,0,1,.359,16.255,4.9,4.9,0,0,1,.29,12.762l0-.015a9.6,9.6,0,0,0,.282-1.911A9.6,9.6,0,0,0,.294,8.926C.032,7.709-.238,6.45.359,5.417c.619-1.07,1.864-1.464,3.068-1.846A8.941,8.941,0,0,0,5.16,2.894,8.485,8.485,0,0,0,6.548,1.768C7.442.939,8.455,0,9.745,0s2.3.94,3.2,1.768a8.484,8.484,0,0,0,1.388,1.125,8.946,8.946,0,0,0,1.733.679h0c1.2.382,2.449.776,3.068,1.846A4.9,4.9,0,0,1,19.2,8.911l0,.015a9.608,9.608,0,0,0-.282,1.911,9.6,9.6,0,0,0,.282,1.909c.261,1.218.532,2.476-.066,3.509a3.671,3.671,0,0,1-2.006,1.485l.012.016a23.449,23.449,0,0,0-2.388.8c-.046.023-.1.054-.162.093-.086.041-.172.084-.257.128a8.481,8.481,0,0,0-1.388,1.126l-.143.133,0,0c-.23.2-.447.387-.627.551h0a3.858,3.858,0,0,1-2.427,1.084A3.858,3.858,0,0,1,7.317,20.59Z"
        transform="translate(-24379.039 2253)"
        fill={themeColor}
      />
      <g transform="translate(-24372.367 2259.408)">
        <path
          d="M0,0H4.848V1.655H1.679V3.262h3.17V4.888H1.679V7.226h3.17V8.888H0V0"
          fill="#fff"
        />
        <path
          d="M.692,0a.67.67,0,0,1,.493.205.678.678,0,0,1,.2.5.671.671,0,0,1-.2.489A.671.671,0,0,1,.692,1.4.665.665,0,0,1,.2,1.19.672.672,0,0,1,0,.7a.678.678,0,0,1,.2-.5A.664.664,0,0,1,.692,0"
          transform="translate(7.652 3.588)"
          fill="#fff"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconELogo)
