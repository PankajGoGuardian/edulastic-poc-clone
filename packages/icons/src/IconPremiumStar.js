import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPremiumStar = (props) => {
  return (
    <SVG
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.99967 11.8466L12.1197 14.3333L11.0263 9.64663L14.6663 6.49329L9.87301 6.08663L7.99967 1.66663L6.12634 6.08663L1.33301 6.49329L4.97301 9.64663L3.87967 14.3333L7.99967 11.8466Z"
        fill="#FEB63A"
      />
    </SVG>
  )
}

export default withIconStyles(IconPremiumStar)
