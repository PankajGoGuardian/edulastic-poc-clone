/* eslint-disable react/prop-types */
import React from 'react'

import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconQuestion = (props) => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.302 14.099" {...props}>
    <g transform="translate(0)">
      <path
        d="M23.931.966A5.837,5.837,0,0,0,20.486,0a4.91,4.91,0,0,0-2.66.68A4.142,4.142,0,0,0,16,4.294h2.651a2.609,2.609,0,0,1,.444-1.431A1.653,1.653,0,0,1,20.6,2.174a1.728,1.728,0,0,1,1.487.559,2.057,2.057,0,0,1,.407,1.239,1.872,1.872,0,0,1-.446,1.082,2.3,2.3,0,0,1-.53.528,11.969,11.969,0,0,0-2.069,1.624,3.107,3.107,0,0,0-.431,1.95c0,.064.023.2.253.2h2.062a.225.225,0,0,0,.25-.213,2.31,2.31,0,0,1,.113-.686,2.122,2.122,0,0,1,.785-.939l.73-.492a7.855,7.855,0,0,0,1.416-1.235A3.229,3.229,0,0,0,25.3,3.829,3.276,3.276,0,0,0,23.931.966Zm-3.487,9.939a1.579,1.579,0,0,0-1.7,1.559,1.661,1.661,0,1,0,1.7-1.559Z"
        transform="translate(-16)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconQuestion)
