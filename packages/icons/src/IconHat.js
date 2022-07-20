/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconHat = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="24"
    viewBox="0 0 30 24"
    fill="none"
    {...props}
  >
    <path
      d="M14.9999 0L0.333252 8L14.9999 16L26.9999 9.45333V18.6667H29.6666V8L14.9999 0ZM5.66658 13.5733V18.9067L14.9999 24L24.3333 18.9067V13.5733L14.9999 18.6667L5.66658 13.5733Z"
      fill="black"
    />
  </SVG>
)

export default withIconStyles(IconHat)
