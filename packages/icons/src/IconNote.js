/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconNote = (props) => (
  <SVG
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.33329 3.33317H16.6666V13.3332H4.30829L3.33329 14.3082V3.33317ZM3.33329 1.6665C2.41663 1.6665 1.67496 2.4165 1.67496 3.33317L1.66663 18.3332L4.99996 14.9998H16.6666C17.5833 14.9998 18.3333 14.2498 18.3333 13.3332V3.33317C18.3333 2.4165 17.5833 1.6665 16.6666 1.6665H3.33329ZM4.99996 9.99984H11.6666V11.6665H4.99996V9.99984ZM4.99996 7.49984H15V9.1665H4.99996V7.49984ZM4.99996 4.99984H15V6.6665H4.99996V4.99984Z"
      fill="#1AB395"
    />
  </SVG>
)

export default withIconStyles(IconNote)
