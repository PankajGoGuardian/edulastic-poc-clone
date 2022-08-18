/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconTimer = (props) => (
  <SVG
    width="18"
    height="21"
    viewBox="0 0 18 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 19C7.14348 19 5.36301 18.2625 4.05025 16.9497C2.7375 15.637 2 13.8565 2 12C2 10.1435 2.7375 8.36301 4.05025 7.05025C5.36301 5.7375 7.14348 5 9 5C10.8565 5 12.637 5.7375 13.9497 7.05025C15.2625 8.36301 16 10.1435 16 12C16 13.8565 15.2625 15.637 13.9497 16.9497C12.637 18.2625 10.8565 19 9 19ZM16.03 6.39L17.45 4.97C17 4.46 16.55 4 16.04 3.56L14.62 5C13.07 3.74 11.12 3 9 3C6.61305 3 4.32387 3.94821 2.63604 5.63604C0.948211 7.32387 0 9.61305 0 12C0 14.3869 0.948211 16.6761 2.63604 18.364C4.32387 20.0518 6.61305 21 9 21C14 21 18 16.97 18 12C18 9.88 17.26 7.93 16.03 6.39ZM8 13H10V7H8V13ZM12 0H6V2H12V0Z"
      fill="#53B095"
    />
  </SVG>
)

export default withIconStyles(IconTimer)