import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCloseCircle = (props) => {
  const { fill, ...restProps } = props
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23.592 23.576"
      {...restProps}
    >
      <g transform="translate(0 -0.168)">
        <ellipse
          cx="11.796"
          cy="11.788"
          rx="11.796"
          ry="11.788"
          transform="translate(0 0.168)"
          fill={fill || '#e04f5f'}
        />
        <g transform="translate(21.103 11.956) rotate(135)">
          <rect
            width="2.58"
            height="13.163"
            transform="translate(5.29 0)"
            fill="#fff"
          />
          <rect
            width="13.163"
            height="2.58"
            transform="translate(0 5.29)"
            fill="#fff"
          />
        </g>
      </g>
    </SVG>
  )
}

export default withIconStyles(IconCloseCircle)
