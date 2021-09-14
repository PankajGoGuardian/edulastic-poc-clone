/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconHourGlass = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="11.482"
    height="15.31"
    viewBox="0 0 11.482 15.31"
    {...props}
  >
    <path
      d="M13.845,14.034h-.638V11.946A3.671,3.671,0,0,0,11.993,9.22l-1.08-.972a.8.8,0,0,1,0-1.186l1.08-.972a3.675,3.675,0,0,0,1.214-2.727V1.276h.638a.638.638,0,1,0,0-1.276H3.638a.638.638,0,0,0,0,1.276h.638V3.364A3.671,3.671,0,0,0,5.49,6.09l1.08.972a.8.8,0,0,1,0,1.186l-1.08.972a3.675,3.675,0,0,0-1.214,2.727v2.088H3.638a.638.638,0,0,0,0,1.276H13.845a.638.638,0,1,0,0-1.276ZM6.19,12.011A1.742,1.742,0,0,1,6.7,10.771l1.7-1.7a.479.479,0,0,1,.677,0l1.7,1.7a1.742,1.742,0,0,1,.514,1.241v2.023H6.19Z"
      transform="translate(-3)"
    />
  </SVG>
)

export default withIconStyles(IconHourGlass)
