import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconQTIUploadTest = (props) => (
  <SVG
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="21" cy="21" r="21" fill="#57AE09" fillOpacity="0.14" />
    <path
      d="M27 24V27H15V24H13V27C13 28.1 13.9 29 15 29H27C28.1 29 29 28.1 29 27V24H27ZM16 18L17.41 19.41L20 16.83V25H22V16.83L24.59 19.41L26 18L21 13L16 18Z"
      fill="#57AE09"
    />
  </SVG>
)

export default withIconStyles(IconQTIUploadTest)
