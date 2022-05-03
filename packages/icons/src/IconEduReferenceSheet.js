/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconEduReferenceSheet = (props) => (
  <SVG
    data-cy="icon-reference-sheet"
    xmlns="http://www.w3.org/2000/svg"
    width="12.802"
    height="16.293"
    viewBox="0 0 12.802 16.293"
    {...props}
  >
    <g transform="translate(-5 -2)">
      <path
        d="M17.22,10.728a.582.582,0,0,0-.582.582v5.237a.582.582,0,0,1-.582.582H6.746a.582.582,0,0,1-.582-.582V7.819a.582.582,0,0,1,.582-.582H9.655a.582.582,0,0,0,.582-.582V3.746a.582.582,0,0,1,.582-.582h1.164a.582.582,0,1,0,0-1.164H10.137A1.734,1.734,0,0,0,8.9,2.511L5.511,5.9A1.735,1.735,0,0,0,5,7.137v9.41a1.746,1.746,0,0,0,1.746,1.746h9.31A1.746,1.746,0,0,0,17.8,16.547V11.31A.582.582,0,0,0,17.22,10.728ZM9.073,3.987V6.073H6.987Z"
        transform="translate(0 0)"
      />
      <path
        d="M21.909,2H19.582A.582.582,0,0,0,19,2.582V9.564a.582.582,0,0,0,.9.484l1.423-.95,1.423.948a.582.582,0,0,0,.9-.483V3.746A1.746,1.746,0,0,0,21.909,2Zm.582,6.477-.841-.56a.582.582,0,0,0-.645,0l-.841.56V3.164h1.746a.582.582,0,0,1,.582.582Z"
        transform="translate(-5.854 0)"
      />
      <path
        d="M16.4,24H10.582a.582.582,0,0,0,0,1.164H16.4A.582.582,0,0,0,16.4,24Z"
        transform="translate(-2.091 -9.199)"
      />
      <path
        d="M16.4,19H10.582a.582.582,0,0,0,0,1.164H16.4A.582.582,0,1,0,16.4,19Z"
        transform="translate(-2.091 -7.108)"
      />
      <path
        d="M10.582,15.164h2.909a.582.582,0,0,0,0-1.164H10.582a.582.582,0,0,0,0,1.164Z"
        transform="translate(-2.091 -5.017)"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconEduReferenceSheet)
