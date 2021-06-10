/* eslint-disable react/prop-types */
import React from 'react'
import { themeColorBlue } from '@edulastic/colors'
import styled from 'styled-components'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAddItem = (props) => (
  <AddItem
    style={{ fill: '#1AB394' }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 13.531 16.913"
    {...props}
  >
    <g transform="translate(-51)">
      <g transform="translate(51)">
        <path
          className="a"
          d="M62.839,16.913a1.7,1.7,0,0,0,1.691-1.691V1.691A1.7,1.7,0,0,0,62.839,0H57.765V5.92L55.651,4.651,53.537,5.92V0h-.846A1.7,1.7,0,0,0,51,1.691V15.222a1.7,1.7,0,0,0,1.691,1.691Z"
          transform="translate(-51)"
        />
      </g>
    </g>
  </AddItem>
)

const AddItem = styled(SVG)`
  &:hover {
    g {
      fill: ${themeColorBlue};
    }
  }
`

export default withIconStyles(IconAddItem)
