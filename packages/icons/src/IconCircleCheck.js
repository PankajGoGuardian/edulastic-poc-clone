/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconCircleCheck = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="38"
    viewBox="0 0 38 38"
    {...props}
  >
    <g transform="translate(-513 -159)">
      <circle cx="19" cy="19" r="19" transform="translate(513 159)" />
      <g transform="translate(523 118.353)">
        <g transform="translate(0 53.55)">
          <path
            fill="currentColor"
            d="M5.806,64.541,1.452,60.186,0,61.638l5.806,5.806L18.249,55,16.8,53.55Z"
            transform="translate(0 -53.55)"
          />
        </g>
      </g>
    </g>
  </SVG>
)

const styledIconCircleCheck = styled(IconCircleCheck)`
  color: ${(p) => p.checkColor};
`

const enhancedIconCircleCheck = withIconStyles(
  styledIconCircleCheck,
  {
    circleColor: PropTypes.string,
  },
  {
    color: '#eef7e5',
    checkColor: '#5fb502',
  }
)

export default enhancedIconCircleCheck
