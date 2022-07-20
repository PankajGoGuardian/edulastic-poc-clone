/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTestLibrary = (props) => (
  <SVG
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 2V8L12 6L10 8V2H6V18H16V2H14ZM0 5V3H2V2C2 0.89 2.9 0 4 0H16C17.05 0 18 0.95 18 2V18C18 19.05 17.05 20 16 20H4C2.95 20 2 19.05 2 18V17H0V15H2V11H0V9H2V5H0ZM2 3V5H4V3H2ZM2 17H4V15H2V17ZM2 11H4V9H2V11Z"
      fill="black"
      fillOpacity="0.6"
    />
  </SVG>
)

export default withIconStyles(IconTestLibrary)
