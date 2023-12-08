/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconNoPremiumWarning = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g transform="translate(0.001 0)">
      <circle cx="12" cy="12" r="12" fill="#FEB63A" />
      <path
        d="M12.7607 15.0801H11.2051L10.7832 6.15039H13.1826L12.7607 15.0801ZM10.6777 17.9102C10.6777 17.4297 10.8008 17.0928 11.0469 16.8994C11.2988 16.7002 11.6064 16.6006 11.9697 16.6006C12.3271 16.6006 12.6318 16.7002 12.8838 16.8994C13.1357 17.0928 13.2617 17.4297 13.2617 17.9102C13.2617 18.3789 13.1357 18.7188 12.8838 18.9297C12.6318 19.1348 12.3271 19.2373 11.9697 19.2373C11.6064 19.2373 11.2988 19.1348 11.0469 18.9297C10.8008 18.7188 10.6777 18.3789 10.6777 17.9102Z"
        fill="black"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconNoPremiumWarning)
