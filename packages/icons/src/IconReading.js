/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconReading = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="46.999"
    height="46.998"
    viewBox="0 0 46.999 46.998"
    {...props}
  >
    <g transform="translate(0 -0.006)">
      <g transform="translate(0 0.006)">
        <path
          d="M44.245,25.119V20.752a1.377,1.377,0,0,0-1.377-1.377,41.537,41.537,0,0,0-8,.73A12.432,12.432,0,0,0,29.7,17.112a9.639,9.639,0,1,0-12.395,0A12.434,12.434,0,0,0,12.133,20.1a41.545,41.545,0,0,0-8-.73,1.377,1.377,0,0,0-1.377,1.377v4.368A4.137,4.137,0,0,0,0,29.013v2.754a4.137,4.137,0,0,0,2.754,3.894v4.368a1.377,1.377,0,0,0,1.377,1.377,32.043,32.043,0,0,1,18.6,5.368,1.381,1.381,0,0,0,1.528,0,32.043,32.043,0,0,1,18.6-5.368,1.377,1.377,0,0,0,1.377-1.377V35.661A4.137,4.137,0,0,0,47,31.767V29.013A4.138,4.138,0,0,0,44.245,25.119ZM16.615,9.736A6.885,6.885,0,1,1,23.5,16.621,6.939,6.939,0,0,1,16.615,9.736ZM4.131,33.144a1.378,1.378,0,0,1-1.377-1.377V29.013a1.377,1.377,0,0,1,2.754,0v2.754A1.378,1.378,0,0,1,4.131,33.144ZM22.122,43.157A34.451,34.451,0,0,0,5.508,38.671V35.661a4.137,4.137,0,0,0,2.754-3.894V29.013a4.137,4.137,0,0,0-2.754-3.894V22.148a31.123,31.123,0,0,1,16.615,4.857ZM23.5,24.62a32.724,32.724,0,0,0-8.011-3.683,9.658,9.658,0,0,1,5.257-1.563h5.508a9.658,9.658,0,0,1,5.257,1.563A32.722,32.722,0,0,0,23.5,24.62ZM41.491,38.671a34.454,34.454,0,0,0-16.615,4.486V27.007a31.12,31.12,0,0,1,16.615-4.859v2.971a4.137,4.137,0,0,0-2.754,3.894v2.754a4.137,4.137,0,0,0,2.754,3.894Zm2.754-6.9a1.377,1.377,0,0,1-2.754,0V29.013a1.377,1.377,0,0,1,2.754,0Z"
          transform="translate(0 -0.006)"
          fill="#b0bac1"
        />
      </g>
    </g>
  </SVG>
)

export default withIconStyles(IconReading)
