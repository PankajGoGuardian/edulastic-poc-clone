/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconWord = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="32.891"
    height="44.851"
    viewBox="0 0 32.891 44.851"
    {...props}
  >
    <g transform="translate(-60 0)">
      <path
        d="M0,44.851V0H22.048L32.891,10.843V44.851Zm2.99-2.99H29.9v-28.9H19.934V2.99H2.99ZM22.924,9.967h4.862L22.924,5.1ZM19.346,35.881l-2.9-8.7-2.9,8.7H11.2L6.062,20.918l2.828-.971,3.459,10.071,2.92-8.755h2.354l2.92,8.755L24,19.947l2.828.971L21.69,35.881Z"
        transform="translate(60 0)"
        fill="#b0bac1"
      />
    </g>
  </SVG>
)

export default withIconStyles(IconWord)
