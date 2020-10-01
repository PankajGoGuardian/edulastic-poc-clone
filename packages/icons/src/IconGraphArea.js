import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconGraphArea = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19.084 20.005"
    {...props}
  >
    <path
      d="M8.219,2,6.781,3.406,9.563,6.188l-5.75,5.594H3.781a3,3,0,0,0,0,4.219l.063.063,5.063,5.031A2.9,2.9,0,0,0,13,21.219l5.094-5.125a2.966,2.966,0,0,0,0-4.187l-2-2L11.719,5.5,11,4.781Zm2.75,5.594,3.719,3.719,2,2a1,1,0,0,1,.344.688H4.906a.912.912,0,0,1,.313-.781ZM20,16s-2,2.9-2,4a2,2,0,0,0,4,0C22,18.9,20,16,20,16Z"
      transform="translate(-2.916 -2)"
      stroke="none"
    />
  </SVG>
)

export default withIconStyles(IconGraphArea)
