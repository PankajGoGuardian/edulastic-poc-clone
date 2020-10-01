/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconRubrics = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23.448 22.876"
    {...props}
  >
    <g transform="translate(-13.728 -20.165)">
      <path
        d="M22.186,315.669a1.168,1.168,0,0,0-1.652,0l-1.906,1.906-1.906-1.906a1.168,1.168,0,0,0-1.651,1.652l1.906,1.907-1.906,1.906a1.168,1.168,0,1,0,1.651,1.652l1.906-1.907,1.906,1.907a1.168,1.168,0,0,0,1.652-1.652l-1.907-1.906,1.907-1.907A1.168,1.168,0,0,0,22.186,315.669Z"
        transform="translate(-1 -280.086)"
      />
      <path
        d="M47.179,36.552H39.588V28.962a1.168,1.168,0,0,0-2.336,0v7.591H29.661a1.168,1.168,0,1,0,0,2.336h7.591v7.591a1.168,1.168,0,0,0,2.336,0V38.888h7.592a1.168,1.168,0,0,0,0-2.336Z"
        transform="translate(-13.153 -6.334)"
      />
      <path
        d="M302.135,21.405a1.168,1.168,0,0,0-1.637.218l-3.727,4.868-1.365-1.024a1.168,1.168,0,0,0-1.4,1.869l2.29,1.717a1.158,1.158,0,0,0,.7.233,1.17,1.17,0,0,0,.928-.458l4.429-5.786A1.167,1.167,0,0,0,302.135,21.405Z"
        transform="translate(-265.417 -1)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconRubrics)
