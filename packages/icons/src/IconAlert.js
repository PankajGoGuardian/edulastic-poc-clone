import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconAlert = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="28.651"
    height="24.638"
    viewBox="0 0 28.651 24.638"
    {...props}
  >
    <g transform="translate(0 -35.857)">
      <g transform="translate(0 35.857)">
        <g transform="translate(0)">
          <path
            d="M28.282,56.592,16.529,37.1a2.574,2.574,0,0,0-4.409,0L.369,56.592a2.574,2.574,0,0,0,2.2,3.9h23.5a2.574,2.574,0,0,0,2.2-3.9Zm-1.587,1.678a.71.71,0,0,1-.617.36H2.573a.709.709,0,0,1-.607-1.074l11.752-19.49a.709.709,0,0,1,1.214,0l11.752,19.49A.709.709,0,0,1,26.694,58.269Z"
            transform="translate(0 -35.857)"
            fill="#434b5d"
          />
        </g>
      </g>
      <g transform="translate(13.07 43.532)">
        <g transform="translate(0 0)">
          <path
            d="M234.841,173.005c-.71,0-1.263.381-1.263,1.056,0,2.059.242,5.019.242,7.078,0,.536.467.761,1.021.761.415,0,1-.225,1-.761,0-2.059.242-5.019.242-7.078A1.112,1.112,0,0,0,234.841,173.005Z"
            transform="translate(-233.578 -173.005)"
            fill="#434b5d"
          />
        </g>
      </g>
      <g transform="translate(13.019 53.621)">
        <g transform="translate(0 0)">
          <path
            d="M233.984,353.306a1.333,1.333,0,1,0,0,2.665,1.333,1.333,0,0,0,0-2.665Z"
            transform="translate(-232.651 -353.306)"
            fill="#434b5d"
          />
        </g>
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconAlert)
