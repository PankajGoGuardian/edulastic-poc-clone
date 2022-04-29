/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconReferenceGuid = (props) => (
  <SVG
    data-cy="icon-reference-guid"
    xmlns="http://www.w3.org/2000/svg"
    width="13.447"
    height="16.293"
    viewBox="0 0 13.447 16.293"
    {...props}
  >
    <g transform="translate(-18.347)">
      <path
        d="M29.991,0H23.146a1.805,1.805,0,0,0-1.8,1.8v.221H20.15a1.805,1.805,0,0,0-1.8,1.8V14.49a1.805,1.805,0,0,0,1.8,1.8H27a1.805,1.805,0,0,0,1.8-1.8v-.221h1.193a1.805,1.805,0,0,0,1.8-1.8V1.8A1.805,1.805,0,0,0,29.991,0ZM27.635,14.49a.641.641,0,0,1-.64.64H20.15a.641.641,0,0,1-.64-.64V3.828a.641.641,0,0,1,.64-.64H27a.641.641,0,0,1,.64.64V14.49Zm3-2.025a.641.641,0,0,1-.64.64H28.8V3.828a1.805,1.805,0,0,0-1.8-1.8H22.506V1.8a.641.641,0,0,1,.64-.64h6.845a.641.641,0,0,1,.64.64V12.465Z"
        transform="translate(0)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconReferenceGuid)
