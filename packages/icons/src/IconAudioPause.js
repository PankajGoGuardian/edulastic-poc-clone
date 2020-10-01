import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAudioPause = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.52 15.57" {...props}>
    <g transform="translate(0)">
      <g transform="translate(0)">
        <path
          d="M91.058,15.009a.561.561,0,0,1-.561.561H87.411a.561.561,0,0,1-.561-.561V.561A.561.561,0,0,1,87.411,0H90.5a.561.561,0,0,1,.561.561Z"
          transform="translate(-86.85)"
        />
        <path
          d="M308.186,15.009a.561.561,0,0,1-.561.561h-3.086a.561.561,0,0,1-.561-.561V.561A.561.561,0,0,1,304.539,0h3.086a.561.561,0,0,1,.561.561Z"
          transform="translate(-297.666)"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconAudioPause)
