import React from 'react'
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles'
import SVG from '@edulastic/icons/src/common/SVG'

const IconSpecialCharacters = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="23.083"
    height="14"
    viewBox="0 0 23.083 14"
    {...props}
  >
    <path fill="none" d="M0 0h48v48H0z" />
    <path d="M25.74 30.15l-5.08-5.02.06-.06c3.48-3.88 5.96-8.34 7.42-13.06H34V8H20V4h-4v4H2v3.98h22.34C22.99 15.84 20.88 19.5 18 22.7c-1.86-2.07-3.4-4.32-4.62-6.7h-4c1.46 3.26 3.46 6.34 5.96 9.12L5.17 35.17 8 38l10-10 6.22 6.22 1.52-4.07zM37 20h-4l-9 24h4l2.25-6h9.5L42 44h4l-9-24zm-5.25 14L35 25.33 38.25 34h-6.5z" />
  </SVG>
)

export default withIconStyles(IconSpecialCharacters)
