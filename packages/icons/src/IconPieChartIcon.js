import React from 'react'
import { themeColorBlue } from '@edulastic/colors'
import styled from 'styled-components'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPieChartIcon = (props) => (
  <PieChartIcon
    style={{ fill: '#1AB394' }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17.031 18.923"
    {...props}
  >
    <g transform="translate(-1462 -166)">
      <rect
        className="a"
        width="17.031"
        height="17.031"
        rx="3"
        transform="translate(1462 167.892)"
      />
      <g transform="translate(1465.785 181.138) rotate(-90)">
        <rect
          style={{ fill: '#f2f2f2' }}
          className="b"
          width="1.892"
          height="9.462"
          transform="translate(3.785)"
        />
        <rect
          style={{ fill: '#f2f2f2' }}
          className="b"
          width="1.892"
          height="6.586"
        />
        <rect
          style={{ fill: '#f2f2f2' }}
          className="b"
          width="1.892"
          height="9.425"
          transform="translate(7.569)"
        />
      </g>
      <g
        style={{ fill: '#f2f2f2', stroke: '#00AD50' }}
        className="c"
        transform="translate(1468.445 166)"
      >
        <circle
          style={{ stroke: 'none' }}
          className="d"
          cx="1.892"
          cy="1.892"
          r="1.892"
        />
        <circle
          style={{ fill: 'none' }}
          className="e"
          cx="1.892"
          cy="1.892"
          r="1.392"
        />
      </g>
    </g>
  </PieChartIcon>
)

const PieChartIcon = styled(SVG)`
  &:hover {
    g {
      fill: ${themeColorBlue};
    }
  }
`

export default withIconStyles(IconPieChartIcon)
